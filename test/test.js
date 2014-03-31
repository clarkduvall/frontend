describe('Directive: progress circle', function() {
  var $compile,
      $rootScope;

  beforeEach(module('progressCircle'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Creates an svg', function() {
    var element = $compile('<div progress-circle></div>')($rootScope);
    $rootScope.$digest();

    // Sanity test that this creates an SVG.
    expect(element.html()).toContain('svg');
  });

  it('Creates two arcs, one bigger than the other', function() {
    var element = $compile('<div progress-circle actual="1.0" expected="0.5">' +
                           '</div>')($rootScope),
        inner,
        outer;
    $rootScope.$digest();

    inner = element.find('.expected')[0];
    outer = element.find('.actual')[0];
    expect(outer.getTotalLength()).toBeGreaterThan(inner.getTotalLength());
  });

  it('Changes arc length based on actual progress', function() {
    $rootScope.actual = 0.0;
    var element = $compile('<div progress-circle actual="actual" expected="0.5">' +
                           '</div>')($rootScope),
        outer,
        baseLength,
        length;
    $rootScope.$digest();

    outer = element.find('.actual')[0];
    baseLength = outer.getTotalLength();

    $rootScope.actual = 0.1;
    $rootScope.$digest();
    length = outer.getTotalLength();
    expect(outer.getTotalLength()).not.toBe(0.0);

    $rootScope.actual = 0.2;
    $rootScope.$digest();
    expect(outer.getTotalLength()).toBeCloseTo(length * 2 - baseLength, 0);
  });

  it('Changes color based on progress', function() {
    $rootScope.actual = 0.0;
    var element = $compile('<div progress-circle actual="actual" expected="0.5">' +
                           '</div>')($rootScope),
        outer;
    $rootScope.$digest();

    outer = element.find('.actual');
    expect(outer.css('fill')).toBe('#ff0000');

    $rootScope.actual = 0.5;
    $rootScope.$digest();
    expect(outer.css('fill')).not.toBe('#ff0000');
  });
});

describe('Service: color blending', function() {
  var Color;

  beforeEach(module('progressCircle'));

  beforeEach(inject(function(_Color_) {
    Color = _Color_;
  }));

  it('Converts objects to rgb strings', function() {
    expect(Color.str({
      r: 255,
      g: 255,
      b: 255
    })).toBe('rgb(255, 255, 255)');

    expect(Color.str({
      r: 1,
      g: 2,
      b: 3
    })).toBe('rgb(1, 2, 3)');
  });

  it('Blends two colors together', function() {
    var c1 = {
          r: 100,
          g: 100,
          b: 100
        },
        c2 = {
          r: 200,
          g: 200,
          b: 200
        };

    expect(Color.blend(c1, c2, 1.0)).toBe('rgb(100, 100, 100)');
    expect(Color.blend(c1, c2, 0.0)).toBe('rgb(200, 200, 200)');
    expect(Color.blend(c1, c2, 0.5)).toBe('rgb(150, 150, 150)');
    expect(Color.blend(c1, c2, 0.25)).toBe('rgb(175, 175, 175)');
  });
});
