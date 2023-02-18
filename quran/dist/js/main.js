var xmlhttp,
  surah = 0,
  markno = "";
url = "https://raw.githubusercontent.com/iherbs/quran-json/main/";
let surah_list = {}, surah_data = [];
function _(id) {
  let el = {}, ismodal = false;
  if (id.substr(0, 1) == "#") {
    el = document.getElementById(id.substr(1, id.length));
    if (el.classList.contains("modal")) {
      ismodal = true;
    }
  } else if (id.substr(0, 1) == ".") {
    el = document.querySelectorAll(id);
  }

  if (ismodal) {
    el.modal = function (opt = "") {
      if (opt == "show") {
        el.style.display = "block";
        document
          .getElementsByTagName("body")[0]
          .setAttribute("style", "overflow:hidden;");
      } else if (opt == "hide") {
        el.style.display = "none";
        document.getElementsByTagName("body")[0].removeAttribute("style");
      }
    };
  }

  return el;
}

_(".modaloverlay").forEach((el) =>
  el.addEventListener("click", (event) => {
    event.target.parentNode.style.display = "none";
    let mop = true;
    for (m in _(".modaloverlay")) {
      if (!isNaN(m)) {
        if (_(".modaloverlay")[m].parentNode.style.display == "block") {
          mop = false;
        }
      }
    }
    if (mop) {
      document.getElementsByTagName("body")[0].removeAttribute("style");
    }
  })
);

_(".modalclose").forEach((el) =>
  el.addEventListener("click", (event) => {
    event.target.parentNode.parentNode.style.display = "none";
    let mop = true;
    for (m in _(".modaloverlay")) {
      if (!isNaN(m)) {
        if (_(".modaloverlay")[m].parentNode.style.display == "block") {
          mop = false;
        }
      }
    }
    if (mop) {
      document.getElementsByTagName("body")[0].removeAttribute("style");
    }
  })
);

function toast(txt = "") {
  var x = document.getElementById("toast");
  x.innerHTML = txt;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
    x.innerHTML = "";
  }, 3000);
}

async function get(file = "") {
  return new Promise((resolve, _reject) => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        // console.log(xmlhttp.responseText);
        resolve(xmlhttp.responseText);
      }
    };
    xmlhttp.send();
  });
}

//==============================================================================

function openNav() {
  _("#sidenavoverlay").style.display = "block";
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  _("#sidenavoverlay").style.display = "none";
  document.getElementById("mySidenav").style.width = "0";
}

function setTheme() {
  if (_("#btntheme").checked == true) {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

function setTransliteration() {
  if (_("#btntransliteration").checked == true) {
    localStorage.setItem("transliteration", "true");
  } else {
    localStorage.setItem("transliteration", "false");
  }
}

function setTranslate() {
  if (_("#btntranslate").checked == true) {
    localStorage.setItem("translate", "true");
  } else {
    localStorage.setItem("translate", "false");
  }
}

function setTajweed() {
  if (_("#btntajweed").checked == true) {
    localStorage.setItem("tajweed", "true");
  } else {
    localStorage.setItem("tajweed", "false");
  }
}

//==============================================================================

async function getqlist() {
  _("#list").innerHTML = `<div style="width:100%;height:150px;"><div class="loader"></div></div>`;
  let re = await get(url + "surah_list.json");
  re = JSON.parse(re);
  surah_list = re;
  // console.log(re);
  makeqlist();
}

function makeqlist(key = "") {
  let re = surah_list,
    table = "";
  for (i in re) {
    if (
      key == "" ||
      re[i]["id"] == key ||
      re[i]["name"].toLowerCase().includes(key.toLowerCase()) ||
      re[i]["text_id"].toLowerCase().includes(key.toLowerCase()) ||
      re[i]["altername"].toLowerCase().includes(key.toLowerCase())
    ) {
      table += `<div class="row listitem" onclick="getsurah(${re[i]["id"]})">
            <div class="col"><div class="star8" style="top:5px;" data-label="${re[i]["id"]}"></div></div>
            <div class="col">
                <span class="nmayah">${re[i]["name"]}</span>
                <small class="arti">(${re[i]["text_id"]})</small>
                <span class="type">${re[i]["type_id"] + ", " + re[i]["count"] + " Ayat"}</span>
            </div>
            <div class="col arabic" style="text-align:right;float:right;font-size:18px;">${re[i]["text"]}</div>
        </div>`;
    }
  }
  _("#list").innerHTML = table;
}

function cari(qry = "") {
  carikata(qry);
}

async function carikata(qry = "") {
  xmlhttp.abort();
  qry = qry.toLowerCase().trim();
  let table = "";
  let kw = qry.split(" ");
  let transliteration = localStorage.getItem("transliteration");
  let translate = localStorage.getItem("translate");
  let tajweed = localStorage.getItem("tajweed");

  if (qry != "") {
    let srlt = surah_list, adalist = false;
    _("#wload").innerHTML = `<div style="width:100%;height:150px;"><div class="loader"></div></div>`;
    for (let q = 1; q <= 114; q++) {
      let re = await get(url + "Surah/" + q + ".json");
      let arr = JSON.parse(re);

      for (r in arr) {
        let n = parseInt(r) + parseInt(1);
        // console.log(stem(arr[r]['text_id']));
        let ayat = arr[r]["text_id"].toLowerCase();
        let ada = 0;
        for (w in kw) {
          if (ayat.includes(kw[w])) {
            ada = ada + 1;
          }
        }
        if (ada == kw.length) {
          // console.log({ "no_surah": q, "no_ayah": n, "surah": surah_list[q], "ayah": arr[r] });
          table += `<tr onclick="getsurah(${q},${n})">
                            <td class="ayah">
                                <div style="color:var(--color-title-text);font-weight:bold;margin-bottom:5px;">
                                ${srlt[q]["name"] + " (" + q + ":" + n + ")"}
                                </div>
                                <div class="arabic" style="width:100%;text-align:right;font-size:24px;line-height:2;margin-bottom:10px;">
                                    ${parseArabic(arr[r]["text_ayah"], tajweed)}
                                </div>
                                ${transliteration == "true" ? `<span class="artr"><i>${arr[r]["transliteration"]}</i></span>` : ``}
                                ${translate == "true" ? `<span class="arid">${arr[r]["text_id"]}</span>` : ``}
                            </td>
                        </tr>`;
        }
      }
    }

    for (i in srlt) {
      if (
        qry == "" ||
        srlt[i]["id"] == qry ||
        srlt[i]["name"].toLowerCase().includes(qry.toLowerCase()) ||
        srlt[i]["text_id"].toLowerCase().includes(qry.toLowerCase()) ||
        srlt[i]["altername"].toLowerCase().includes(qry.toLowerCase())
      ) {
        adalist = true;
      }
    }

    _("#wload").innerHTML = "";

    if (!adalist && table == "") {
      _("#list").innerHTML +=
        '<div style="width:100%;text-align:center;padding:20px;margin-top:20px;color:var(--color-title-text);">&bull; &bull; &bull; &bull;</div>';
    } else {
      _("#list").innerHTML +=
        '<table class="surah" style="overflow:hidden;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">' +
        table +
        "</table>";
    }
  }
}

async function getsurah(surat = 1, nayah = "") {
  surah = surat;
  window.location.hash = "#surah";
  let srh = surah_list[surah];
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;
  _("#wrapmenu").style.display = "block";
  _("#tsurah").innerHTML = surah + ") " + srh["name"];

  let re = await get(url + "Surah/" + surah + ".json");
  re = JSON.parse(re);
  surah_data = re;
  // console.log(re);

  let ayah = "", gotono = "";
  let transliteration = localStorage.getItem("transliteration");
  let translate = localStorage.getItem("translate");
  let tajweed = localStorage.getItem("tajweed");

  for (i in re) {
    let mark = surah + "_" + re[i]["no_ayah"];
    ayah += `<tr id="n${re[i]["no_ayah"]}">
            <td style="text-align:center;vertical-align:top;padding-top:15px;padding-left:15px;width:55px;">
                <div class="star8" style="cursor:pointer;" data-label="${re[i]["no_ayah"]}" onclick="showtafsir(${re[i]["id"]})"></div>
                <div class="bookmark" id="bm${mark}" onclick="addmdlBookmark('${mark}')" style="margin-left:8px;"></div>
            </td>
            <td class="ayah" ondblclick="copylink(${surah},${re[i]["no_ayah"]})">
                <div class="arabic" style="width:100%;text-align:right;font-size:24px;line-height:2;margin-bottom:10px;">
                    ${parseArabic(re[i]["text_ayah"], tajweed)}
                </div>
                ${transliteration == "true" ? `<span class="artr"><i>${re[i]["transliteration"]}</i></span>` : ``}
                ${translate == "true" ?
        `<span class="arid">${re[i]["text_id"].replaceAll("<sup>", `<sup class="fnote" onclick="showfnote(${i})">`)}</span>` : ``}
            </td>
        </tr>`;

    gotono += `<div class="listayah" onclick="gotoayah(${re[i]["no_ayah"]})">${re[i]["no_ayah"]}</div>`;
  }
  _("#gotoayah").innerHTML = gotono;

  let bismillah = "";
  if (surah != 1) {
    bismillah = '<tr><td colspan="3"><div class="arabic bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div></td></tr>';
  }

  _(
    "#surah"
  ).innerHTML = `<table style="width:100%;padding-bottom:10px;margin-top:10px;border-bottom:2px solid #8d6e63;">
    <tr>
        <td style="vertical-align:middle;text-align:center;font-size:24px;">
            <i class="fa-solid fa-house"></i>
        </td>
        <td style="padding:10px;">
            <span class="nmayah">${srh["id"]})&nbsp;${srh["name"]}</span>
            <small class="arti">(${srh["text_id"]})</small>
            <span class="type">${srh["type_id"] + ", " + srh["count"] + " Ayat"}</span>
        </td>
        <td style="vertical-align:middle;text-align:right;font-size:24px;padding:10px;">
            <div class="arabic">${srh["text"]}<div>
        </td>
    </tr>
</table>

<table class="surah">${bismillah + ayah}</table>`;
  window.scrollTo({ top: 0 });
  if (nayah != "") {
    let dims = _("#n" + nayah).getBoundingClientRect();
    window.scrollTo(window.scrollX, dims.top - 40);
  }
}

async function getayah(surat = 1, nayah = 1) {
  window.location.hash = "#qs" + surat + "." + nayah;
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;
  _("#tsurah").innerHTML = `<span id="tohome" onclick="history.replaceState(null, null, ' ');window.location.reload();" class="icon-home" style="position:relative;top:2px;margin-right:5px;cursor:pointer;"></span>`;
  _("#wrapmenu").style.display = "block";
  _("#tohome").style.display = "none";
  _("#toayah").style.display = "none";
  _("#lnav").style.display = "none";
  _("#rnav").style.display = "none";

  let resl = await get(url + "surah_list.json");

  surah_list = JSON.parse(resl);
  let srh = surah_list[surat];

  let re = await get(url + "Surah/" + surat + ".json");
  re = JSON.parse(re);
  surah_data = re;
  // console.log(re);

  let ayah = `<tr id="n${re[nayah - 1]["no_ayah"]}" style="background:var(--color-content);">
              <td style="text-align:center;vertical-align:top;padding-top:15px;padding-left:15px;width:55px;">
                  <div class="star8" data-label="${re[nayah - 1]["no_ayah"]}" onclick="showtafsir(${re[nayah - 1]["id"]})" style="cursor:pointer;"></div>
              </td>
              <td class="ayah">
                  <div class="arabic" style="width:100%;text-align:right;font-size:24px;line-height:2;margin-bottom:10px;">
                      ${parseArabic(re[nayah - 1]["text_ayah"])}
                  </div>
                  <span class="artr"><i>${re[nayah - 1]["transliteration"]}</i></span>
                  <span class="arid">
                  ${re[nayah - 1]["text_id"].replaceAll("<sup>", `<sup class="fnote" onclick="showfnote(${nayah - 1})">`)}
                  </span>
              </td>
          </tr>`;

  _("#surah").innerHTML = `<table style="width:100%;padding-bottom:10px;margin-top:10px;border-bottom:2px solid #8d6e63;">
      <tr>
          <td style="vertical-align:middle;text-align:center;font-size:24px;">
              <i class="fa-solid fa-house"></i>
          </td>
          <td style="padding:10px;">
              <span class="nmayah">${srh["id"]})&nbsp;${srh["name"]}</span>
              <small class="arti">(${srh["text_id"]})</small>
              <span class="type">${srh["type_id"] + ", " + srh["count"] + " Ayat"}</span>
          </td>
          <td style="vertical-align:middle;text-align:right;font-size:24px;padding:10px;">
              <div class="arabic">${srh["text"]}<div></td>
      </tr>
  </table>

  <table class="surah">${ayah}</table>`;
  window.scrollTo({ top: 0 });
}

function gotoayah(i = 1) {
  window.scrollTo({ top: 0 });
  let dims = _("#n" + i).getBoundingClientRect();
  window.scrollTo(window.scrollX, dims.top - 40);
  _("#modalgotoayah").modal("hide");
}

function showfnote(i = 0) {
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML =
    `<span class="widgettittle">Catatan</span>` +
    surah_data[i]["text_fn"].replaceAll("</br>", "</br></br>");
}

async function showtafsir(id = 0) {
  if (id != 0) {
    _("#modalwidget").modal("show");
    _("#widgetcontent").innerHTML = '<div class="loader"></div>';
    let re = await get(url + "Tafsir/" + id + ".json");
    re = JSON.parse(re);
    _("#widgetcontent").innerHTML =
      `<span class="widgettittle">Tafsir Wajiz</span><div class="arabic" style="text-align:justify;text-justify:inter-word;">` +
      re["tafsir_wajiz"] +
      `</div><br><br><span class="widgettittle">Tafsir Tahlili</span><div class="arabic" style="text-align:justify;text-justify:inter-word;">` +
      re["tafsir_tahlili"] +
      `</div>`;
  }
}

function nextsurah() {
  surah = parseInt(surah) + parseInt(1);
  if (surah > 114) {
    surah = 1;
  }
  getsurah(surah);
}

function prevsurah() {
  surah = parseInt(surah) - parseInt(1);
  if (surah < 1) {
    surah = 114;
  }
  getsurah(surah);
}

function pegon(me, t = "") {
  if (t == "l") {
    _("#txtar").value = latara(me.value);
  } else if (t == "a") {
    _("#txtla").value = aralat(me.value);
  }
}

function showpegon() {
  closeNav();
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML = `<span class="widgettittle">Pegon</span>
    <textarea placeholder="Teks latin" id="txtla" class="form-control" style="height:70px;font-size:16px;" onkeyup="pegon(this,'l')"></textarea>
    <textarea placeholder="Teks Arab" id="txtar" class="form-control" style="height:70px;font-size:16px;text-align:right;font-family:'Arabic';" onkeyup="pegon(this,'a')"></textarea>`;
}

function copylink(surat = 1, ayat = 1) {
  navigator.clipboard.writeText(
    location.protocol +
    "//" +
    location.host +
    location.pathname +
    "#qs" +
    surat +
    "." +
    ayat
  );
  toast("Copied");
}

//==============================================================================

function addfrmBookmark() {
  _("#ttladdbook").innerHTML = "Tambah Bookmark";
  _("#addfrmbook").style.display = "none";
  _("#bookmarkfolder").style.display = "none";
  _("#terakhirbaca").style.display = "none";
  _("#bookmarkadd").style.display = "block";
}

function bataladdBookmark() {
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#grupbookmark").value = "";
}

function addmdlBookmark(mark = "") {
  markno = mark;
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#bookmarkpage").modal("show");
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#nomark").value = mark;
  let book = JSON.parse(localStorage.getItem("bookmark"));

  _(
    "#terakhirbaca"
  ).innerHTML = `<div class="listbooktitle nmayah" style="text-align:center;cursor:pointer;" onclick="setterakhirbaca('${mark}')">Tandai Terakhir Baca</div>`;

  if (book.length == 0) {
    _("#bookmarkfolder").innerHTML = "";
    // '<div style="text-align:center;color:var(--color-text);">Belum ada bookmark</div>';
  } else {
    let listbook = "";
    for (b in book) {
      listbook += `<div class="listbook" onclick="addBookmark('${book[b]}','${markno}')" style="padding:10px 10px 5px 10px;">
                    <div class="bookmark" style="display:inline-block;position:relative;width:16px;"></div>
                    <span class="nmayah" style="position:relative;display:inline-block;top:-6px;">${book[b]}</span>
                </div>`;
    }
    _("#bookmarkfolder").innerHTML = listbook;
  }
}

function setterakhirbaca(mark) {
  localStorage.setItem("terakhirbaca", mark);
  _("#bookmarkpage").modal("hide");
}

function newBookmark() {
  let name = _("#grupbookmark").value;
  let book = JSON.parse(localStorage.getItem("bookmark"));
  if (localStorage.getItem(name) == null) {
    book.unshift(name);
    localStorage.setItem("bookmark", JSON.stringify(book));
    if (markno != "") {
      localStorage.setItem(name, '["' + markno + '"]');
      markno = "";
      _("#bookmarkpage").modal("hide");
    } else {
      localStorage.setItem(name, "[]");
      bataladdBookmark();
      dataBookmark();
    }
  } else {
    // bookmark sudah ada
    if (markno != "") {
      addmdlBookmark(markno);
    } else {
      bataladdBookmark();
      dataBookmark();
    }
  }
  _("#grupbookmark").value = "";
}

function addBookmark(book = "", mark = "") {
  // console.log(book, mark);
  if (book != "" && mark != "") {
    let b = JSON.parse(localStorage.getItem(book));
    if (!b.includes(mark)) {
      b.unshift(mark);
      localStorage.setItem(book, JSON.stringify(b));
    }
  }
  _("#bookmarkpage").modal("hide");
}

function dataBookmark() {
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#bookmarkpage").modal("show");

  let trbaca = localStorage.getItem("terakhirbaca");
  _(
    "#terakhirbaca"
  ).innerHTML = `<div class="listbooktitle nmayah" style="text-align:center;cursor:pointer;" onclick="gotoBookmark('${trbaca}')">Terakhir Baca</div>`;

  let listbook = "";
  let book = JSON.parse(localStorage.getItem("bookmark"));
  for (g in book) {
    listbook += `<div style="margin-bottom:15px;">
            <div class="listbooktitle">
                <div class="bookmark" style="display:inline-block;position:relative;width:16px;"></div>
                <span class="nmayah" style="position:relative;display:inline-block;top:-6px;">${book[g]}</span>
                <div class="delbook" style="float:right;" onclick="confdelBookmark('${book[g]}')">&times;</div>
            </div>`;
    let mark = JSON.parse(localStorage.getItem(book[g]));
    for (b in mark) {
      let bm = mark[b].split("_");
      listbook += `<div class="listbook" id="blist${mark[b]
        }" style="margin-left:25px;padding-bottom:2px;">
        <div class="delbook" style="float:right;" onclick="confdelBookmark('${book[g]
        }','${mark[b]}')">&times;</div>
        <div class="arabic" style="float:right;font-size:18px;">${surah_list[bm[0]]["text"]
        }</div>
        <div onclick="gotoBookmark('${mark[b]
        }')" style="width:100%;height:100%;">
            <span class="nmayah" style="display:block;">
                ${bm[0] + ") " + surah_list[bm[0]]["name"]}
            </span><small style="position:relative;top:-6px;">Ayat ${bm[1]
        }</small>
        </div>
    </div>`;
    }
    listbook += `</div>`;
  }

  _("#bookmarkfolder").innerHTML =
    listbook == ""
      ? '<div style="width:100%;text-align:center;padding:20px;margin-top:20px;color:var(--color-title-text);">&bull; &bull; &bull; &bull;</div>'
      : listbook;
}

function gotoBookmark(mark = "") {
  let m = mark.split("_");
  if (m.length == 2) {
    _("#bookmarkpage").modal("hide");
    getsurah(m[0], m[1]);
  }
}

function confdelBookmark(book = "", mark = "") {
  _("#confirmbox").modal("show");
  // console.log(mark);
  let bm = "",
    notif = "";
  if (mark != "") {
    bm = mark.split("_");
    notif = `bookmark <b>${book}, ${surah_list[bm[0]]["name"]
      }</b>, Ayat ${bm[1]}?`;
  } else {
    notif = `<b>${book}</b>?<br><small>(Menghapus nama bookmark akan menghapus seluruh daftar pada bookmark tersebut.)</small>`;
  }
  _("#confirmcontent").innerHTML = `<h3>Hapus Bookmark</h3><br>
        Yakin hapus bookmark ${notif}
        <br>
        <div style="margin-top:10px;">
            <button type="button" class="btn btn-theme" onclick="delBookmark('${book}','${mark}')">Hapus</button>
            <button type="button" class="btn btn-secondary" onclick="_('#confirmbox').modal('hide');">Batal</button>
        </div>`;
}

function delBookmark(book = "", mark = "") {
  if (book != "") {
    if (mark != "") {
      let b = JSON.parse(localStorage.getItem(book));
      var index = b.indexOf(mark);
      if (index >= 0) {
        b.splice(index, 1);
      }
      localStorage.setItem(book, JSON.stringify(b));
    } else {
      localStorage.removeItem(book);
      let b = JSON.parse(localStorage.getItem("bookmark"));
      var index = b.indexOf(book);
      if (index >= 0) {
        b.splice(index, 1);
      }
      localStorage.setItem("bookmark", JSON.stringify(b));
    }
    dataBookmark();
  }
  _("#confirmbox").modal("hide");
}

//==============================================================================

_("#scrolltop").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

_("#cari").addEventListener("keyup", () => {
  let key = _("#cari").value;
  if (key != "") {
    _("#clearsrc").style.display = "block";
  } else {
    _("#clearsrc").style.display = "none";
  }
  makeqlist(key);
  if (key.length > 2) {
    cari(key);
  }
});

_("#clearsrc").addEventListener("click", () => {
  _("#clearsrc").style.display = "none";
  _("#cari").value = "";
  makeqlist();
});

window.addEventListener("scroll", function () {
  // console.log(window.document.documentElement.scrollTop);
  if (window.document.documentElement.scrollTop > 100) {
    _("#scrolltop").style.display = "block";
  } else {
    _("#scrolltop").style.display = "none";
  }
});

window.onhashchange = function () {
  // console.log(window.location.hash);
  // history.replaceState(null, null, ' '); // remove hash
  let pg = window.location.hash;
  if (pg == "") {
    history.replaceState(null, null, " ");
    surah = 0;
    markno = "";
    surah_data = [];
    _("#home").style.display = "block";
    _("#surah").style.display = "none";
    _("#surah").innerHTML = "";
    _("#tsurah").innerHTML = "";
    _("#wrapmenu").style.display = "none";
    _("#gotoayah").innerHTML = "";
    bataladdBookmark();

    document.getElementsByTagName("body")[0].removeAttribute("style");
    for (m in _(".modal")) {
      if (!isNaN(m)) {
        _(".modal")[m].style.display = "none";
      }
    }
  }
};

if (localStorage.getItem("theme") == null) {
  localStorage.setItem("theme", "auto");
}
if (localStorage.getItem("transliteration") == null) {
  localStorage.setItem("transliteration", "true");
}
if (localStorage.getItem("translate") == null) {
  localStorage.setItem("translate", "true");
}
if (localStorage.getItem("tajweed") == null) {
  localStorage.setItem("tajweed", "true");
}
if (localStorage.getItem("terakhirbaca") == null) {
  localStorage.setItem("terakhirbaca", "1_1");
}
if (localStorage.getItem("bookmark") == null) {
  localStorage.setItem("bookmark", "[]");
}

let theme = localStorage.getItem("theme");
if (theme == "auto") {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    _("#btntheme").checked = true;
  } else {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("data-theme", "light");
    _("#btntheme").checked = false;
  }
} else {
  document.getElementsByTagName("body")[0].setAttribute("data-theme", theme);
  if (theme == "dark") {
    _("#btntheme").checked = true;
  }
}

if (localStorage.getItem("transliteration") == "true") {
  _("#btntransliteration").checked = true;
}
if (localStorage.getItem("translate") == "true") {
  _("#btntranslate").checked = true;
}
if (localStorage.getItem("tajweed") == "true") {
  _("#btntajweed").checked = true;
}

let pg = window.location.hash;
if (pg.substring(0, 3) == "#qs") {
  let qs = pg.substring(3, pg.length).split(".");
  getayah(qs[0], qs[1]);
} else {
  getqlist();
}
