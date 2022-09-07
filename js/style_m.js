const { createApp, reactive, onMounted, onUnmounted } = Vue;
const main = {
	setup() {
		const info = reactive({
			menuOn: false,

			waiting: false, //
			curNo: 0,// 현재 content 영역 번호
			conLen: null,// content 수
			lan: 1, // 1: KR,  2: EN

			bgNo: -1,// 0 = 항상 첫번재 사진부터 보여지게
			bgTimer: null,
			bg1Urls: ["image/m/bg_01-1@2x.webp", "image/m/bg_01-2@2x.webp", "image/m/bg_01-3@2x.webp"],
			bg2Urls: ["image/m/bg_02@2x.webp"],
			bg3Urls: ["image/m/bg_03@2x.webp"],
			bg4Urls: ["image/m/bg_04@2x.webp"],
			bg5Urls: ["image/m/bg_05@2x.webp"],

			vh: null,

			// touch관련
			touchStartNo: 0,
			touchEndNo: 0,
			touchDir: 1, // 1 : 아래로,  -1 : 위로

			urls: [], // 교육, 컨퍼런스 정보
		})

		// 메뉴보이기
		menuShow = () => {
			info.menuOn ? info.menuOn = false : info.menuOn = true;
		}

		tStartFc = (e) => {
			info.touchStartNo = e.touches[0].screenY;
		}
		tEndFc = (e) => {
			info.touchEndNo = e.changedTouches[0].screenY;

			if(Math.abs(info.touchEndNo - info.touchStartNo) > 100 && !info.waiting) {
				// 이래로
				if(info.touchEndNo - info.touchStartNo > 0) {
					if(info.curNo > 0) {
						info.curNo -= 1;
					} else {
						info.curNo = 0;
					}
				}
				// 위로
				else if(info.touchEndNo - info.touchStartNo < 0) {
					if(info.curNo < info.conLen - 1) {
						info.curNo += 1;
					} else {
						info.curNo = info.conLen - 1;
					}
				}

				moveEffect();
			}
		}

		// 언어 바꾸기 관련?
		const changeLan = (no) => {
			info.lan = no;// 1: KR,  2: EN
		}

		// 메뉴 선택 시 화면 이동
		const moveShow = (no, menubo) => {
			// 메뉴에서 선택 시
			if(menubo) {
				info.menuOn = false;
				setTimeout(() => {
					info.curNo = no;
					moveEffect();
				}, 400);
			}
			// 오른쪽 점(.) 선택 시
			else {
				info.curNo = no;
				moveEffect();
			}
		}

		// 이동시 효과
		moveEffect = () => {
			clearTimeout(info.bgTimer);
			if(info.curNo !== 5) {// 찾아오는 길
				if(info.curNo, info["bg" + (info.curNo + 1) + "Urls"].length > 1) {// url이 두개 이상일 때만
					noChange();
				}
			}

			// 2번째 화면에 높이용 클래스 추가
			if(info.curNo === 1) {
				setTimeout(() => {
					document.querySelector(".view_wrap.v2").classList.add("heig");
				}, 700);
			}
			// 3번째 화면에 높이용 클래스 추가
			else if(info.curNo === 2) {
				setTimeout(() => {
					document.querySelector(".view_wrap.v3").classList.add("heig");
				}, 700);
			}
			// 4번째 화면에 높이용 클래스 추가
			else if(info.curNo === 3) {
				setTimeout(() => {
					document.querySelector(".view_wrap.v4").classList.add("show");
				}, 700);
			}
			// 5번째 화면에 높이용 클래스 추가
			else if(info.curNo === 4) {
				setTimeout(() => {
					document.querySelector(".view_wrap.v5").classList.add("show");
				}, 700);
			}
			// 6번째 화면에 높이용 클래스 추가
			else if(info.curNo === 5) {
				setTimeout(() => {
					document.querySelector(".view_wrap.v6").classList.add("show");
				}, 700);
			}
			//
			else {
				document.querySelector(".view_wrap.v2").classList.remove("heig");// 없어도 될듯?
			}

			// wheel이 가능한 시간
			setTimeout(() => {
				info.waiting = false;
				info.bgNo = 0;
			}, 600);
		}

		// 배경 이미지 fade in/out용
		noChange = () => {
			info.bgTimer = setTimeout(() => {
				if(info.curNo === 0) {
					if(info.bgNo < info.bg1Urls.length - 1) {
						info.bgNo += 1;
					} else {
						info.bgNo = 0;
					}
					noChange();
				} else {
					clearTimeout(info.bgTimer);
				}
			}, 4000);
		}

		// 100vh 일 때 아이폰에서 툴바랑 주소창 때문에 100vh가 제대로 안나오는 현상 수정용
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		info.vh = vh;

		// resize
		window.addEventListener("resize", () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
			info.vh = vh;
		})

		//
		onMounted(() => {
			console.log("mount ok");
			setTimeout(() => {
				info.bgNo = 0;
			}, 10);

			document.addEventListener("touchstart", tStartFc, false);
			document.addEventListener("touchend", tEndFc, false);

			// content 수
			info.conLen = document.querySelectorAll(".view_wrap").length;

			noChange();

			// 교육, 컨퍼런스 불러오기
			axios.get("json/urls.json")
			.then((response) => {
				info.urls = response.data;
			})
			.catch((error) => {
				console.log(error);
			});
		})

		onUnmounted(() => {
			// document.removeEventListener("touchmove", wheelFc);
			document.removeEventListener("touchstart", tStartFc);
			document.removeEventListener("touchend", tEndFc);
		})

		return {
			info, menuShow, changeLan, moveShow//, scrollFc,
		}
	}
};
createApp(main).mount("#main");
