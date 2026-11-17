
/*
 * Locations for the interactive map.
 * Coordinates use [latitude, longitude].
 * Photos are stored in images/mapa/.
 */

const frankoLocations = [
  {
    id: 1,
    name: "Нагуєвичі — музей-заповідник",
    coordinates: [49.3657638, 23.3631915],
    image: "../images/mapa/Нагуєвичі.jpg",
    description: "У цьому селі на Дрогобиччині 27 серпня 1856 року в родині коваля Якова Франка народився майбутній письменник. Нагуєвичі залишалися для нього головним джерелом дитячих спогадів, фольклорного натхнення та сюжетів для багатьох творів, а нині у відтвореній садибі діє Державний історико-культурний заповідник.",
    order: 1
  },
  {
    id: 2,
    name: "Дрогобич — гімназія",
    coordinates: [49.353639, 23.501487],
    image: "../images/mapa/Дрогобицька гімназія.jpg",
    description: "У Дрогобицькій реальній гімназії імені Франца-Йосифа Франко навчався з 1867 по 1875 рік, де вражав вчителів винятковою пам'яттю, зібрав власну бібліотеку з понад 500 томів і створив свої перші художні твори. Під опікою класного керівника Івана Верхратського тут відбулося його раннє літературне та патріотичне становлення.",
    order: 2
  },
  {
    id: 3,
    name: "Львів — університет",
    coordinates: [49.840056, 24.02201],
    image: "../images/mapa/Львівський Університет.jpg",
    description: "У 1875 році Іван Франко вступив на філософський факультет Львівського університету, де вивчав класичну філологію та українську мову й літературу. Через арешт 1877 року навчання було перерване, а пізніше, попри успішну габілітацію 1895 року, австрійська влада так і не допустила його до викладання на кафедрі через політичну «неблагонадійність».",
    order: 3
  },
  {
    id: 4,
    name: "Дім Франка — музей",
    coordinates: [49.822328, 24.031710],
    image: "../images/mapa/Дім франка.jpg",
    description: "У цьому будинку на вулиці Івана Франка у Львові письменник проживав із родиною з 1902 року до своєї смерті в 1916 році. Сьогодні тут розташований літературно-меморіальний музей, присвячений його життю та творчості.",
    address: "вул. Івана Франка, 150/152, Львів",
    order: 4
  },
  {
    id: 5,
    name: "Віденський університет",
    coordinates: [48.2130162, 16.3608605],
    image: "../images/mapa/Віденській університет.jpg",
    description: "У 1893 році у Віденському університеті під керівництвом видатного славіста В'ячеслава Ягича Франко успішно захистив докторську дисертацію про духовний роман «Варлаам і Йоасаф» і здобув ступінь доктора філософії. Сьогодні в інституті германістики Віденського університету встановлено меморіальну дошку на честь українського вченого.",
    order: 5
  },
  {
    id: 6,
    name: "Могила Івана Франка",
    coordinates: [49.833104, 24.052873],
    image: "../images/mapa/Могила.jpg",
    description: "Іван Франко похований на Личаківському цвинтарі у Львові. Його могила стала одним із важливих місць пам'яті українського письменника. Надгробний пам'ятник, створений скульптором Сергієм Литвиненком, було встановлено у 1933 році.",
    address: "Личаківський цвинтар, Львів",
    order: 7
  },
  {
    id: 7,
    name: "Київ",
    coordinates: [50.4500, 30.5233],
    image: "../images/mapa/Київ.jpg",
    description: "Франко відвідував Київ у 1885 та 1886 роках для співпраці з місцевою інтелігенцією, а в травні 1886 року узяв шлюб із киянкою Ольгою Хоружинською в Павлівській церкві Колегії Павла Ґалаґана. Цей соборний шлюб галичанина та наддніпрянки сприймався сучасниками як символ духовної та культурної єдності Західної й Східної України.",
    order: 6
  },
  {
    id: 8,
    name: "Криворівня",
    coordinates: [48.174551, 24.897527],
    image: "../images/mapa/Криворівня.jpg",
    description: "Це гуцульське село стало постійним місцем літнього відпочинку й творчої праці Франка та його родини на початку XX століття. Завдяки письменникові Криворівня перетворилася на справжнє осереддя культурного життя, де щоліта збиралися Леся Українка, Михайло Грушевський, Михайло Коцюбинський та інші діячі, а нині там функціонує будинок-музей.",
    address: "с. Криворівня, Івано-Франківська область",
    order: 8
  },
  {
    id: 9,
    name: "Чернівецький університет",
    coordinates: [48.29675, 25.92444],
    image: "../images/mapa/Чернівецький університет.jpg",
    description: "Саме у Чернівецькому університеті Франко у 1890–1891 роках прослухав 8-й семестр, необхідний для завершення вищої освіти, оскільки у Львові йому перешкодили політичні арешти. Успішне закінчення навчання в Чернівцях дало йому змогу здобути повну вищу освіту та відкрило шлях до подальшого захисту докторату.",
    address: "вул. Коцюбинського, 2, Чернівці",
    order: 9
  }
];


(() => {
  const mapElement = document.querySelector("#franko-map");
  const imageElement = document.querySelector("#location-image");
  const nameElement = document.querySelector("#location-name");
  const addressElement = document.querySelector("#location-address");
  const descriptionElement = document.querySelector("#location-description");
  const orderElement = document.querySelector("#location-order");
  const nextButton = document.querySelector("#next-location");
  const lightbox = document.querySelector("#map-lightbox");
  const lightboxImage = document.querySelector("#map-lightbox-image");
  const lightboxTitle = document.querySelector("#map-lightbox-title");
  const lightboxDescription = document.querySelector("#map-lightbox-description");
  const lightboxClose = document.querySelector("#map-lightbox-close");

  if (
    !mapElement ||
    !imageElement ||
    !nameElement ||
    !descriptionElement ||
    !orderElement ||
    !nextButton ||
    !lightbox ||
    !lightboxImage ||
    !lightboxTitle ||
    !lightboxDescription ||
    !lightboxClose
  ) return;

  if (!window.L) {
    mapElement.textContent =
      "Щоб відкрити мапу, потрібне підключення до інтернету.";
    mapElement.classList.add("map-unavailable");
    return;
  }

  const locations = [...frankoLocations].sort(
    (a, b) => a.order - b.order
  );

  const map = L.map(mapElement, {
    zoomControl: true,
    scrollWheelZoom: true,
    tap: true,
    zoomSnap: 0.5
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale({
    imperial: false,
    position: "bottomleft"
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: "map-marker-icon",
    html: '<span class="map-pin" aria-hidden="true"><span></span></span>',
    iconSize: [38, 46],
    iconAnchor: [19, 43]
  });

  const markers = new Map();
  let selectedLocation = null;

  const fallbackImage =
    "../images/ivan-franko-map-placeholder.svg";

  const displayImage = () => {
    if (!selectedLocation) return;

    imageElement.src =
      selectedLocation.image || fallbackImage;

    imageElement.alt =
      `Зображення місця: ${selectedLocation.name}`;
  };

  const renderLocation = (
    location,
    { moveMap = true } = {}
  ) => {
    selectedLocation = location;

    const index = locations.findIndex(
      (item) => item.id === location.id
    );

    displayImage();

    nameElement.textContent = location.name;

    if (addressElement) {
      addressElement.textContent =
        location.address || "";
      addressElement.hidden = !location.address;
    }

    descriptionElement.textContent =
      location.description;

    orderElement.textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(locations.length).padStart(2, "0")}`;

    const card =
      document.querySelector("#location-card");

    card?.classList.remove("is-visible");

    requestAnimationFrame(() => {
      card?.classList.add("is-visible");
    });

    markers.forEach((marker, id) => {
      const markerElement = marker.getElement();

      markerElement?.classList.toggle(
        "is-selected",
        id === location.id
      );

      marker.setZIndexOffset(
        id === location.id ? 1000 : 0
      );
    });

    if (moveMap) {
      const targetZoom = Math.min(
        Math.max(map.getZoom(), 9),
        12
      );

      map.flyTo(
        location.coordinates,
        targetZoom,
        { duration: 0.8 }
      );
    }
  };

  locations.forEach((location) => {
    const marker = L.marker(
      location.coordinates,
      {
        icon: pinIcon,
        title: location.name,
        alt: location.name,
        keyboard: true
      }
    ).addTo(map);

    marker.on("click", () => {
      renderLocation(location);
    });

    markers.set(location.id, marker);
  });

  imageElement.addEventListener("error", () => {
    if (
      imageElement.src.endsWith(
        "/ivan-franko-map-placeholder.svg"
      )
    ) return;

    imageElement.src = fallbackImage;
  });

  const openLightbox = () => {
    if (!selectedLocation || lightbox.open) return;

    lightboxImage.src =
      imageElement.currentSrc || imageElement.src;

    lightboxImage.alt = imageElement.alt;

    lightboxTitle.textContent =
      selectedLocation.name;

    lightboxDescription.textContent =
      selectedLocation.description;

    lightbox.showModal();

    document.body.classList.add(
      "map-lightbox-open"
    );

    lightboxClose.focus({
      preventScroll: true
    });
  };

  imageElement.tabIndex = 0;

  imageElement.setAttribute(
    "role",
    "button"
  );

  imageElement.setAttribute(
    "aria-label",
    "Відкрити фотографію у повноекранному перегляді"
  );

  imageElement.addEventListener(
    "click",
    openLightbox
  );

  imageElement.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openLightbox();
      }
    }
  );

  lightboxClose.addEventListener(
    "click",
    () => lightbox.close()
  );

  lightbox.addEventListener(
    "click",
    (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    }
  );

  lightbox.addEventListener(
    "close",
    () => {
      document.body.classList.remove(
        "map-lightbox-open"
      );
    }
  );

  lightbox.addEventListener(
    "cancel",
    () => {
      document.body.classList.remove(
        "map-lightbox-open"
      );
    }
  );

  const allLocations = L.latLngBounds(
    locations.map(
      (location) => location.coordinates
    )
  );

  map.fitBounds(allLocations, {
    padding: [32, 32],
    maxZoom: 6
  });

  nextButton.disabled = false;

  renderLocation(
    locations[0],
    { moveMap: false }
  );

  nextButton.addEventListener(
    "click",
    () => {
      const currentIndex =
        locations.findIndex(
          (location) =>
            location.id === selectedLocation?.id
        );

      const nextLocation =
        locations[
          (currentIndex + 1) %
          locations.length
        ];

      renderLocation(nextLocation);
    }
  );
})();
