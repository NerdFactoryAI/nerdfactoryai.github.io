$(document).ready(function () {
  var $hamburger = $("#spinner-form");
  $hamburger.click(function (e) {
    console.log(e.target.checked);
    if (e.target.checked) {
      $(".nav-mobile").show();
      $(".nerdfactory-main-nav").css("height", 150);
    } else {
      $(".nav-mobile").hide();
      $(".nerdfactory-main-nav").css("height", 100);
    }
    // $menulink.toggleClass('active');
    // $menu.toggleClass('active');
  });
});

