"use strict";

// ---------- Initialisation des boutons de réponse ----------
function changeState(imageId, yesButtons, noButtons) {
      // on a cliqué sur le bouton non
      if (imageId.slice(0, 3) === 'yes') {
        let yesSvg = yesButtons[imageId.slice(-1) - 1].firstChild;
        // on change la couleur dans le style du svg de "cls-2"
        let elemBgColor_svg = yesSvg.contentDocument.querySelector('#bg-color');
        elemBgColor_svg.classList.remove("vert");
        elemBgColor_svg.classList.add("gris");

        // on met le bouton non en rose
        let noImage = noButtons[imageId.slice(-1) - 1].firstChild
        elemBgColor_svg = noImage.contentDocument.querySelector('#bg-color');
        elemBgColor_svg.classList.remove("gris");
        elemBgColor_svg.classList.add("rose");

        // on enlève dans le localStorage le bouton oui
        localStorage.removeItem('yes' + imageId.slice(-1));
      }
      // on a cliqué sur le bouton oui
      else {
        let noImage = noButtons[imageId.slice(-1) - 1].firstChild;
        let elemBgColor_svg = noImage.contentDocument.querySelector('#bg-color');
        elemBgColor_svg.classList.remove("rose");
        elemBgColor_svg.classList.add("gris");

        // on met le bouton oui en vert
        let yesImage = yesButtons[imageId.slice(-1) - 1].firstChild
        elemBgColor_svg = yesImage.contentDocument.querySelector('#bg-color');
        elemBgColor_svg.classList.remove("gris");
        elemBgColor_svg.classList.add("vert");

        // on enlève dans le localStorage le bouton non
        localStorage.removeItem('no' + imageId.slice(-1));
      }
}

const homeStories = function () {
    anime({
    targets: '#swipe_invite_right',
    scale: 1.1,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop: true
  });
  anime({
    targets: '#swipe_invite_left',
    scale: 1.1,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop: true
  });

  let swipe_invite_right = document.querySelector('#swipe_invite_right');
  let swipe_invite_left = document.querySelector('#swipe_invite_left');
  swipe_invite_left.style.opacity = '0';

  let loader = document.querySelector('#loader');
  loader.style.opacity = '1';
  let retour = document.querySelector('#back_button');
  retour.style.display = 'none';
  let container = document.querySelector('#container');

  /* Premier slider pour choisir quel story cliquer */
  // Init of the (touch friendly) Swiper slider
    const swiperHomeStories = new Swiper("#swiperHomeStories", {
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      allowTouchMove: true, // à mettre en false quand on aura fini de coder pour eviter de swiper
    });

    swiperHomeStories.on("slideChange", function () {
      switch (swiperHomeStories.realIndex) {
        case 0:
          swipe_invite_left.style.opacity = '0';
          break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          swipe_invite_left.style.display = 'block';
          swipe_invite_left.style.opacity = '1';
          swipe_invite_right.style.display = 'block';
          swipe_invite_right.style.opacity = '1';
          break;
        case 7:
          swipe_invite_right.style.opacity = '0';
          break;
      }
    });

    swipe_invite_right.addEventListener('click', () => {
        swiperHomeStories.slideNext();
    });
    swipe_invite_left.addEventListener('click', () => {
        swiperHomeStories.slidePrev();
    });

    // on cache le slider au chargement de la page
    document.querySelector('#mySwiper').style.display = 'none';

    // Init of the (touch friendly) Swiper slider
    const swiper = new Swiper("#mySwiper", {
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      allowTouchMove: false, // a mettre en false quand on aura fini de coder pour eviter de swiper
      loop: true // pour swiper en boucle
    });

    /* Fonction executée à chaque slide qui permet de changer le contenu de la slide */
    swiper.on("slideChange", function () {
      // on récupère les boutons previous et next
      let next = document.querySelectorAll('.next');
      let previous = document.querySelectorAll('.previous');

      next.forEach(button => {
        button.addEventListener('click', () => {
          swiper.slideNext();
          document.querySelector('.content').scrollIntoView();
          // on arrete tous les audios
          document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.nextElementSibling.querySelector('.playIcon').style.display = 'inline';
            audio.nextElementSibling.querySelector('.pauseIcon').style.display = 'none';
          });
        });
      })
      previous.forEach(button => {
        button.addEventListener('click', () => {
          swiper.slidePrev();
          document.querySelector('.content').scrollIntoView();
          // on arrete tous les audios
          document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            audio.nextElementSibling.querySelector('.playIcon').style.display = 'inline';
            audio.nextElementSibling.querySelector('.pauseIcon').style.display = 'none';
          });
        });
      })
    });


    // get recap button
    let recap = document.querySelector('#recap_button');
    recap.addEventListener('click', () => {
      fetch('/quartiers-2/recap.html')
        .then(res => res.text())
        .then(html => {
          loader.style.display = 'block';
          loader.style.opacity = '1';
          loader.style.zIndex = '3000';

          container.innerHTML = html;

          retour = document.querySelector('#back_button');
          retour.style.display = 'block';


          setTimeout(() => {
            anime({
                delay: 1000,
                targets: '#loader',
                opacity: '0',
                'z-index' : -1,
            });
          }, 900);

          // on enlève le loader
          retour = document.querySelector('#back_button');
          retour.addEventListener('click', () => {
            fetch('/quartiers-2/stories.html')
              .then(res => res.text())
              .then(html => {
                loader.style.opacity = '1';
                loader.style.display = 'block';

                retour.style.display = 'none';


                // on rajoute a notre container le body de la page credits
                container.innerHTML = html;

                // on attend 1 seconde
                setTimeout(() => {
                  anime({
                      delay: 300,
                      targets: '#loader',
                      opacity: '0',
                      'z-index' : -1,
                  });
                }, 300);
                // on init l'accueil
                homeStories();
              });
          });

          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          leafletCSS.crossOrigin = '';

          // Create new script element for Leaflet JS
          const leafletJS = document.createElement('script');
          leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          leafletJS.crossOrigin = '';

          // Create new link element for recap CSS
          const recapCSS = document.createElement('link');
          recapCSS.rel = 'stylesheet';
          recapCSS.type = 'text/css';
          recapCSS.href = './css/recap.css';

          // Append the created elements to the body
          document.body.appendChild(leafletCSS);
          document.body.appendChild(leafletJS);
          document.body.appendChild(recapCSS);

          // Execute the recapPage function after the Leaflet JS script has loaded and the CSS has been added
          leafletJS.onload = function() {
            // on attend 1 seconde
            setTimeout((() => {recapPage()}), 2000);
          };
        });
    });

    /* a factoriser */
    let credits = document.querySelector('#credits_button');
    credits.addEventListener('click', () => {
      fetch('/quartiers-2/credits.html')
        .then(res => res.text())
        .then(html => {
          loader.style.display = 'block';
          loader.style.opacity = '1';
          loader.style.zIndex = '3000';

          // on rajoute a notre container le body de la page credits
          container.innerHTML = html;
          retour = document.querySelector('#back_button');
          retour.style.display = 'block';

          setTimeout(() => {
            anime({
                delay: 800,
                targets: '#loader',
                opacity: '0',
                'z-index' : -1,
            });
          }, 800);

          // on enlève le loader
          retour = document.querySelector('#back_button');
          retour.addEventListener('click', () => {
            fetch('/quartiers-2/stories.html')
              .then(res => res.text())
              .then(html => {
                loader.style.opacity = '1';
                loader.style.display = 'block';


                // on rajoute a notre container le body de la page credits

                container.innerHTML = html;

                // on attend 1 seconde
                setTimeout(() => {
                  anime({
                      delay: 300,
                      targets: '#loader',
                      opacity: '0',
                      'z-index' : -1,
                  });
                }, 300);
                // on init l'accueil
                homeStories();
              });
          });
        });
    });



    let stories = document.querySelectorAll(".story");
    let swiper_slides = document.querySelectorAll(".swiper-slide");

    // on enlève la première slide qui est vide
    swiper_slides = Array.prototype.slice.call(swiper_slides, 1, swiper_slides.length);

    // on récupère la deuxième moitié des slides
    swiper_slides = Array.prototype.slice.call(swiper_slides, swiper_slides.length - stories.length, swiper_slides.length);

    // Pour chaque story, on va chercher le contenu de la slide correspondante et ajouter un event listener
    for (let i = 1; i <= stories.length; i++) {
      let slideIndex = i - 1;

      let story = stories[slideIndex]
      let address = "/quartiers-2/story" + i + ".html";

      // on remplit la slide avec le fetch
      fetch(address)
        .then(response => response.text())
        .then(data => {
            swiper_slides[slideIndex].innerHTML = data;
          }
        );

      // On ajoute les event listeners sur les stories pour afficher le slider
      story.addEventListener('click', () => {
        // on enleve le footer recap
        recap.style.display = 'none';

        // on affiche le bouton retour
        retour.style.display = 'block';

        // on met le z-index du footer à 0
        document.querySelector('footer').style.zIndex = "0";

        // on cache invite_swipe left et right
        swipe_invite_left.style.display = 'none';
        swipe_invite_right.style.display = 'none';

        // on met la bonne slide active
        swiper.slideToLoop(slideIndex, 0, true);

        // on cache les stories
        stories.forEach(story => {
          story.style.display = 'none';
        });

        loader.style.display = 'block';
        loader.style.opacity = '1';
        loader.style.zIndex = '3000';


        setTimeout(() => {
          anime({
              delay: 1000,
              targets: '#loader',
              opacity: '0',
              'z-index' : -1,
          });
        }, 1000);


        // on affiche le swiper
        document.querySelector('#mySwiper').style.display = 'block';
        document.querySelector('.content').scrollIntoView();

        let yesImages = document.querySelectorAll('.yesButton');
        let noImages = document.querySelectorAll('.noButton');

        yesImages.forEach((image, index) => {
          // on vérifie dans le localStorage si on a déjà cliqué sur le bouton
          if (localStorage.getItem('yes' + (index + 1))) {
            changeState('no' + (index + 1), yesImages, noImages)
          }
          image.addEventListener('click', function() {
            localStorage.setItem('yes' + (index + 1), 'yes');
            localStorage.removeItem('no' + (index + 1));
            changeState('no' + (index + 1), yesImages, noImages);
            setTimeout(() => {}, 1000);
            document.activeElement.blur();
          });
          image.firstChild.addEventListener('load', function() {
            image.firstChild.contentDocument.querySelector('#bg-color').style.transition = "all 0.2s ease-in-out";
            image.firstChild.contentDocument.querySelector("svg").addEventListener('click', function() {
                localStorage.setItem('yes' + (index + 1), 'yes');
                localStorage.removeItem('no' + (index + 1));
                changeState('no' + (index + 1), yesImages, noImages);
                setTimeout(() => {}, 1000);
                document.activeElement.blur();
            });
          });
        });

        noImages.forEach((image, index) => {
          // on vérifie dans le localStorage si on a déjà cliqué sur le bouton
          if (localStorage.getItem('no' + (index + 1))) {
            changeState('yes' + (index + 1), yesImages, noImages)
          }
          image.addEventListener('click', function() {
            localStorage.setItem('no' + (index + 1), 'no');
            localStorage.removeItem('yes' + (index + 1));
            changeState('yes' + (index + 1), yesImages, noImages);
            setTimeout(() => {}, 1000);
            document.activeElement.blur();
          });
          image.firstChild.addEventListener('load', function() {
            image.firstChild.contentDocument.querySelector('#bg-color').style.transition = "all 0.2s ease-in-out";
            image.firstChild.contentDocument.querySelector("svg").addEventListener('click', function() {
              localStorage.setItem('no' + (index + 1), 'no');
              localStorage.removeItem('yes' + (index + 1));
              changeState('yes' + (index + 1), yesImages, noImages);
              setTimeout(() => {}, 1000);
              document.activeElement.blur();
            });
          });
        });
        // Créer une instance de AudioPlayer pour chaque balise audio
        document.querySelectorAll('.audio-player').forEach(audioPlayerElement => {
            const audioElement = audioPlayerElement.querySelector('audio');
            new AudioPlayer(audioElement, audioPlayerElement);
        });
      });
    }




    // La fleche retour a deux comportements différents selon si le swiper est affiché ou non
    retour = document.querySelector('#back_button');
    retour.addEventListener('click', () => {
      // on réaffiche le bouton recap
      recap.style.display = 'flex';
      // on reaffiche les stories
      stories.forEach(story => {
        story.style.display = 'block';
      });
      retour.style.display = 'none';

      // on coupe tous les audios
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.nextElementSibling.querySelector('.playIcon').style.display = 'inline';
        audio.nextElementSibling.querySelector('.pauseIcon').style.display = 'none';
      });

      document.querySelector('#mySwiper').style.display = 'none';
      // on remet le footer
      document.querySelector('footer').style.zIndex = "6";

      // on remet les boutons swipe
      swipe_invite_left.style.display = 'block';
      swipe_invite_right.style.display = 'block';
    });
  };
