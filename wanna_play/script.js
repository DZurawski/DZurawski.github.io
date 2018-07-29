$(function () {
  var BEAT = 0.25;
  var popsicles = $(".popsicle");
  var timeline = new TimelineMax();

  function sway(object, angle, beatsPerSway) {
    var timeline = new TimelineMax({ repeat: -1 });
    timeline
      .add(TweenMax.to(object, beatsPerSway * BEAT,
        { rotation: angle, ease: Sine.easeIn }))
      .add(TweenMax.to(object, beatsPerSway * BEAT,
        { rotation: -angle, ease: Sine.easeIn }));
    return timeline;
  }

  function grow(object, rate, scaleX = 100, scaleY = 100) {
    var scale = "scale(" + scaleX + ", " + scaleY + ")";
    return TweenMax.to(object, rate, { transform: scale});
  }

  function enterBelow(object, seconds, from = "-350px") {
    var timeline = new TimelineMax();
    var rotation = "rotateY(" + (Math.random() * 720 - 360) + "deg)";
    timeline
      .add(TweenMax.from(object, seconds,
        { bottom: from, transform: rotation, ease: Back.easeOut }));
    return timeline;
  }

  function playAudio() {
    audio.play();
  }

  var timeline = new TimelineMax();
  var s1 = $("#hey-brie-suspensions");
  var s2 = $("#wanna-play-suspensions"); 
  var s3 = $("#maplestory-card");
  var s4 = $("#dan");
  timeline
    .add(TweenMax.from(s1, 1.5, { top: "-75%", ease: Back.easeOut }))
    .add(TweenMax.from(s2, 1.5, { top: "-75%", ease: Back.easeOut }), "-=.25")
    .add(enterBelow($("#green-mushroom-popsicle"), 1), "-=.5")
    .add(enterBelow($("#red-snail-popsicle"), 1), "-=.5")
    .add(enterBelow($("#slime-popsicle"), 1), "-=.5")
    .add(enterBelow($("#orange-mushroom-popsicle"), 1), "-=.5")
    .add(TweenMax.to(s1, 1, { top: "-75%", ease: Power0.easeOut }), "+= 0")
    .add(TweenMax.to(s2, 1, { top: "-75%", ease: Power0.easeOut }), "-= 1")
    .add(TweenMax.from(s3, 1.5, {
      left: "-100%", ease: Power1.easeOut, onStart: playAudio
    }), "-=1")
    .add(TweenMax.from(s4, 2, { right: "-100%", ease: Power0.easeOut }), "-=1")
    .add(TweenMax.to($(".popsicle"), 1, {rotation: "-20deg"}))
    .add([grow(s4, 2000), sway($(".popsicle"), 20, 4)]);

  timeline.progress(0).timeScale(0);

  var audio = document.getElementById("audio");

  $("#play-pause-button").click(function () {
    timeline.progress(0).timeScale(1);
    audio.currentTime = 0;
    audio.pause();
  });

  $("#stop-button").click(function () {
    if (timeline.timeScale() < 0.1) {
      timeline.timeScale(1);
      audio.play();
    } else {
      timeline.timeScale(0);
      audio.pause();
    }
  })
});