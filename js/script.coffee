app = angular.module 'progressCircle', []


app.controller 'Main', ($scope, $interval) ->
  # Set our initial actual/expected.
  $scope.actual = 0.0
  $scope.expected = 0.5

  # Make the progress go back and forth.
  increasing = true
  $interval ->
    if $scope.paused
      return

    $scope.actual += if increasing then 0.003 else -0.003
    if $scope.actual >= 1.0
      $scope.actual = 1.0
      increasing = false

    if $scope.actual <= 0.0
      $scope.actual = 0.0
      increasing = true
  , 50


# A service to deal with colors/blending.
app.service 'Color', ->
    Color = this

    # Create an rgb string from an object with r, g, and b properties.
    this.str = (c) ->
      "rgb(#{c.r.toFixed 0}, #{c.g.toFixed 0}, #{c.b.toFixed 0})"

    # Blend two colors (objects with r, g, and b). A weight close to 1.0 favors
    # c1, and a weight close to 0.0 favors c2.
    this.blend = (c1, c2, weight) ->
      w1 = Math.max 0.0, Math.min weight, 1.0
      w2 = 1.0 - w1
      Color.str
        r: c1.r * w1 + c2.r * w2
        g: c1.g * w1 + c2.g * w2
        b: c1.b * w1 + c2.b * w2

    Color


app.directive 'progressCircle', ($window, Color) ->

  # Set up some variables.
  radius = 1000  # The default size of the svg element.
  diameter = radius * 2
  twoPi = Math.PI * 2

  # The link function for the directive.
  link = (scope, el, attrs) ->
    # Create the main SVG element.
    svg = d3.select el[0]
      .append 'svg'
        .attr 'width', diameter
        .attr 'height', diameter
        # Use viewBox and preserveAspectRatio so it can resize easily.
        .attr 'viewBox', "0 0 #{diameter} #{diameter}"
        .attr 'preserveAspectRatio', 'xMidyMid'

    # Create the main element group, and translate to the center.
    canvas = svg.append 'g'
      .attr 'transform', "translate(#{radius}, #{radius})"

    # A resize function that will fit the circle to the screen.
    resize = ->
      size = Math.min 0.9 * $window.innerHeight, el.width()
      svg.attr 'width', size
        .attr 'height', size

    # Resize, and set the window resize handler.
    resize()
    $window.onresize = _.debounce resize, 200

    # Make an arc generator to be used later.
    arc = d3.svg.arc()
      .startAngle 0

    # Given an inner radius, outer radius, binding (from our scope), and color
    # function, create an arc that will update with the binding.
    createArc = (inner, outer, binding, color) ->
      path = canvas.append 'path'
        .attr 'class', binding
        .datum
          innerRadius: inner
          outerRadius: outer
          endAngle: scope[binding] * twoPi
        .attr 'd', arc
        .style 'fill', color()

      scope.$watch binding, (val) ->
        path
          .attr 'd', arc.endAngle val * twoPi
          .style 'fill', color()

    # Based on the current expected and actual values, fade to the correct
    # color.
    fadeColors = ->
      # Define our red, orange and green colors.
      bad = r: 255, g: 0, b: 0
      medium = r: 255, g: 165, b: 0
      good = r: 120, g: 192, b: 0

      difference = scope.expected - scope.actual
      if difference > 0.5
        Color.str bad
      else if difference > 0.25
        Color.blend bad, medium, 4 * (difference - 0.25)
      else
        Color.blend medium, good, 4 * difference

    # Create the two arcs.
    createArc radius * 0.9, radius, 'actual', fadeColors
    createArc radius * 0.8, radius * 0.86, 'expected', -> '#c7e596'

    # Create the gray middle circle.
    canvas.append 'circle'
      .attr 'r', radius * 0.7
      .attr 'fill', '#f4f4f4'

    # Create the inner number text wrapper.
    text = canvas.append 'text'
      .attr 'class', 'percentage'
      .attr 'font-family', 'Source Sans Pro'
      .attr 'text-anchor', 'middle'
      .attr 'font-size', "#{radius * 0.5}px"
      .attr 'y', radius * 0.06
      .attr 'x', radius * 0.05

    # Change the text based on the value passed in. The value should be the
    # actual completion percentage.
    changeText = (val) ->
      # Font sizes for the "Progress" text and "%" sign.
      progressSize = radius * 0.2
      percentSize = radius * 0.3

      # First set the main percentage text.
      text.text (val * 100).toFixed 0
        # Add a span for the "%" sign.
        .append 'tspan'
          .attr 'font-size', "#{percentSize}px"
          .text '%'
        # Add a span for the "Progress" text.
        .append 'tspan'
          .attr 'font-size', "#{progressSize}px"
          .attr 'x', 0
          .attr 'y', percentSize
          .text 'Progress'

    # Set the text, and watch for any changes on the scope.
    changeText scope.actual
    scope.$watch 'actual', changeText

  link: link
  scope:
    expected: '='
    actual: '='
