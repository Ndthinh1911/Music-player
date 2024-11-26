/**
 * 1.render song
 * 2.scroll top
 * 3. Play / pause/  seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random / repeat
 * 7. Next / Repeat when ended
 * 8. Active Song
 * 9. Scroll active song into view
 * 10. play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const player = $(".player");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const playBtn = $(".toggle-btn");
const audio = $("#audio");
const progress = $("#progress");
const title = $(".title");
const author = $(".author");
const nextBtn = $(".next-btn");
const prevBtn = $(".prev-btn");
const randomBtn = $(".random-btn");
const repeatBtn = $(".repeat-btn");
const optionBtn = $(".btn-option");
const closeBtn = $(".btn-close");
const optionBar = $(".option-bar");
const loveIcon = $(".btn-loved-list-icon");

let listenedSongs = [];
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "3107-2",
      singer: "DuongNau W/n",
      path: "./assets/mp3/31072-DuonggNauWn-6937818.mp3",
      image: "./assets/thumb/song1.jpg",
    },
    {
      name: "Anh Thôi Nhân Nhượng",
      singer: "AnClock",
      path: "./assets/mp3/AnhThoiNhanNhuong-AnClock-15319052.mp3",
      image: "./assets/thumb/song2.jpg",
    },
    {
      name: "Đáp Án Cuối Cùng",
      singer: "Quân AP",
      path: "./assets/mp3/DapAnCuoiCung-QuanAP-7887096.mp3",
      image: "./assets/thumb/song3.jpg",
    },
    {
      name: "Để Anh Lương Thiện",
      singer: "Yên Thành",
      path: "./assets/mp3/DeAnhLuongThien-YenThanh-14826332.mp3",
      image: "./assets/thumb/song4.jpg",
    },
    {
      name: "Đi Giữa Trời Rực Rỡ",
      singer: "Ngô Lan Hương",
      path: "./assets/mp3/DiGiuaTroiRucRo.mp3",
      image: "./assets/thumb/song5.jpg",
    },
    {
      name: "Ngày Tháng Sau Này",
      singer: "Bem feat NguyenxImPoe",
      path: "./assets/mp3/NgayThangSauNay-BemfeatNguyenxImPoe-15732617.mp3",
      image: "./assets/thumb/song6.jpg",
    },
    {
      name: "Say Yes (Vietnamese Verson)",
      singer: "Ogenus, PiaLinh",
      path: "./assets/mp3/SayYesVietnameseVersion-OgenusPiaLinh-16337980.mp3",
      image: "./assets/thumb/song7.jpg",
    },
    {
      name: "Yêu Em 2 ngày",
      singer: "Duong Domic",
      path: "./assets/mp3/YeuEm2Ngay-DuongDomic-13885897.mp3",
      image: "./assets/thumb/song8.jpg",
    },
  ],
  lovedList: [],
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? `active` : ``
            }" data-index="${index}">
          <div
            class="thumb"
            style="background-image: url('${song.image}')"
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fa-regular fa-heart btn-loved-list-icon"></i>
          </div>
        </div>
        `;
    });
    playlist.innerHTML = html.join("");
  },
  renderLovedList: function () {},
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //Phóng to thu nhỏ
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    //Khi press play btn
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //when song is playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //when song is pausing
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //time update
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //Seeking
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };
    //When click next btn
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      _this.scrollIntoView();
      audio.play();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      _this.scrollIntoView();
      audio.play();
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //When audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // event listener on playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const loveBtn = e.target.closest(".btn-loved-list-icon");
      if (songNode || e.target.closest(".option")) {
        //When click  on songs
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        } else if (loveBtn) {
          loveBtn.addEventListener("click", function () {
            loveBtn.classList.toggle("active");
            loveIcon.classList.toggle("active");
            _this.pushToLovedList();
          });
        }
      }
    };
    optionBtn.onclick = function () {
      closeBtn.style.display = "inline-block";
      optionBtn.style.display = "none";
      optionBar.style.display = "inline-block";
    };
  },
  pushToLovedList: function (e) {
    this.lovedList.push(this);
    console.log(this.lovedList);
  },
  loadCurrentSong: function () {
    title.innerHTML = this.currentSong.name;
    author.innerHTML = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollIntoView: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  randomSong: function () {
    let newIndex;
    // for (let i = 0; i < this.songs.length; i++) {
    //   newIndex = Math.floor(Math.random() * this.songs.length);
    //   if (!listenedSongs.includes(newIndex)) {
    //     listenedSongs.push(newIndex);
    //   }
    // }
    // if ((listenedSongs.length = this.songs.length)) {
    //   console.log(listenedSongs);
    //   listenedSongs = [];
    // }
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      listenedSongs.push(newIndex);
    } while (
      newIndex === this.currentIndex &&
      listenedSongs.includes(newIndex)
    );
    this.currentIndex = newIndex;
    console.log(listenedSongs);
    if ((listenedSongs.length = this.songs.length)) {
      listenedSongs = [];
    }

    this.loadCurrentSong();
  },

  start: function () {
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
