window.onload = elementsLoad();

var request;
var objJSON;

function getRequestObject() {
  if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

function OpisProgramu() {
  var description = '<p class="text-center">';
  description += "<h4>Opis projektu</h4>";
  description +=
    "Projekt przedstawia prosty serwis do zbierania danych o trybie życia.";
  description +=
    "Do serwisu można się zalogować, lub można zapisywać dane w trybie offline.";
  description +=
    "Po zalogowaniu dane można zapisać a nastepnie odczytać z bazy danych MongoDB,";
  description += "<h4>Funkcjonalność</h4>";
  description += 'Przycisk "Logowanie" - umożliwia zalogowanie się do serwisu.';
  description +=
    'Przycisk "Rejestracja" - umożliwia rejestrację nowego użytkownika.';
  description +=
    'Przycisk "Wypełnij ankietę" - umożliwia wypełnienie ankiety(w trybie offline po stronie przeglądarki,w trybie online po stronie serwera).';
  description +=
    'Przycisk "Podgląd wyników" - umożliwiwa odczyt zapisanych danych(w trybie offline po stronie przeglądarki, w trybie online po stronie serwera). Funkcja ta pokazuje wszystkie zapisane na serwerze dane(nie tylko aktualnego użytkownika).';
  description +=
    'Po zalogowaniu można także użyc opcji "Wykresy danych", która stworzy wykresy na podstawie wszystkich zapisanych na serwerze danych, gdzie wysokośc wykresu zależy od częstości wprowadzanej wartości w ankcie dla danej osoby.<br>';
  description += "Domyślne dane logowania to login:admin hasło:admin";
  description += "<p>";
  document.getElementById("opisShow").innerHTML = description;
}

function LogowanieDoSerwisu() {
  var login =
    '<div class="text_center"><input type="text" id="log" class="form-control" placeholder="Proszę podać login"> <br> <input type="password" class="form-control" id="pass" placeholder="Proszę podać hasło"> <br><br> <button type="button" class="btn btn-dark" onclick="Login(); return false;">Zaloguj się</button></div>';
  document.getElementById("mainDiv").innerHTML = login;
}

function Login() {
  var user = {};
  user.login = document.getElementById("log").value;
  user.pass = document.getElementById("pass").value;
  txt = JSON.stringify(user);
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      login_name = document.getElementById("log").value;
      var tmp = JSON.parse(request.response);
      document.getElementById("mainDiv").innerHTML =
        '<div class="alert alert-info" role="alert">' + tmp.return + "</div>";

      login_flag = true;
      UzytkownikZalogowany();
      PrzeslijDoBazy();
    } else if (request.readyState == 4 && request.status == 400) {
      var tmp = JSON.parse(request.response);
      document.getElementById("mainDiv").innerHTML =
        '<div class="alert alert-info" role="alert">' + tmp.return + "</div>";
    }
  };
  request.open(
    "POST",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/login",
    true
  );
  request.send(txt);
}

function RejestraWSerwisie() {
  var register =
    '<div class="text_center"><input type="text" class="form-control" id="reg_log" placeholder="Podaj nowy login"> <br> <input type="password" class="form-control" id="reg_pass" placeholder="Podaj nowe hasło"> <br> <button type="button" class="btn btn-dark" onclick="Rejestracja(); return false;">Zarejestruj się</button></div>';
  document.getElementById("mainDiv").innerHTML = register;
}

function Rejestracja() {
  if (WalidacjaNowegoUzyt()) {
    ZarejstrujWBazie();
  }
}

function WalidacjaNowegoUzyt() {
  var login = document.getElementById("reg_log").value;
  var pass = document.getElementById("reg_pass").value;

  if (login == "" || pass == "") {
    document.getElementById("mainDiv").innerHTML =
      '<div class="alert alert-info" role="alert">Należy wypełnić oba pola</div>';
    return false;
  } else {
    return true;
  }
}

function AnkietaPytania() {
  var questions = "<br><h4>Jak czujesz się w ciągu ostatniego tygodnia?</h4> ";
  questions +=
    '<input type="radio" id="ank1" value="1" name="q1"> <label for="ank1"> 1 - bardzo źle </label><br>';
  questions +=
    '<input type="radio" id="ank2" value="2" name="q1"> <label for="ank2"> 2 - źle </label><br>';
  questions +=
    '<input type="radio" id="ank3" value="3" name="q1"> <label for="ank3"> 3 - średnio </label><br>';
  questions +=
    '<input type="radio" id="ank4" value="4" name="q1"> <label for="ank4"> 4 - dobrze </label><br>';
  questions +=
    '<input type="radio" id="ank5" value="5" name="q1"> <label for="ank5"> 5 - bardzo dobrze </label><br><br>';

  questions += "<h4>Jak często uprawiasz sport?</h4> ";
  questions +=
    '<input type="radio" id="q2_1" value="1" name="q2"> <label for="q2_1"> 1 - nigdy </label><br>';
  questions +=
    '<input type="radio" id="q2_2" value="2" name="q2"> <label for="q2_2"> 2 - raz w miesiącu </label><br>';
  questions +=
    '<input type="radio" id="q2_3" value="3" name="q2"> <label for="q2_3"> 3 - raz w tygodniu </label><br>';
  questions +=
    '<input type="radio" id="q2_4" value="4" name="q2"> <label for="q2_4"> 4 - co dwa dni</label><br>';
  questions +=
    '<input type="radio" id="q2_5" value="5" name="q2"> <label for="q2_5"> 5 - codziennie </label><br><br>';

  questions += "<h4>Jak często zażywasz leki na ból głowy?</h4> ";
  questions +=
    '<input type="radio" id="q3_1" value="1" name="q3"> <label for="q3_1"> 1 - nigdy </label><br>';
  questions +=
    '<input type="radio" id="q3_2" value="2" name="q3"> <label for="q3_2"> 2 - raz w miesiącu </label><br>';
  questions +=
    '<input type="radio" id="q3_3" value="3" name="q3"> <label for="q3_3"> 3 - raz w tygodniu </label><br>';
  questions +=
    '<input type="radio" id="q3_4" value="4" name="q3"> <label for="q3_4"> 4 - kilka razy w tygodniu </label><br>';
  questions +=
    '<input type="radio" id="q3_5" value="5" name="q3"> <label for="q3_5"> 5 - codziennie </label><br><br>';

  questions += "<h4>Jak często jesz fast-foody?</h4> ";
  questions +=
    '<input type="radio" id="q4_1" value="1" name="q4"> <label for="q4_1"> 1 - nigdy </label><br>';
  questions +=
    '<input type="radio" id="q4_2" value="2" name="q4"> <label for="q4_2"> 2 - raz w miesiącu </label><br>';
  questions +=
    '<input type="radio" id="q4_3" value="3" name="q4"> <label for="q4_3"> 3 - raz w tygodniu </label><br>';
  questions +=
    '<input type="radio" id="q4_4" value="4" name="q4"> <label for="q4_4"> 4 - kilka razy w tygodniu </label><br>';
  questions +=
    '<input type="radio" id="q4_5" value="5" name="q4"> <label for="q4_5"> 5 - codziennie </label><br><br>';

  document.getElementById("mainDiv").innerHTML = questions;
}

function AnkietaLokalna() {
  AnkietaPytania();
  document.getElementById("mainDiv").innerHTML +=
    '<div class="text_center"><button type="button" class="btn btn-dark" onclick="SprawdzenieCzyZaznaczonoPrzeg()">Zapisz dane</button></div><br>';
}

function AnkietaSerwer() {
  AnkietaPytania();
  document.getElementById("mainDiv").innerHTML +=
    '<div class="text_center"><button type="button" class="btn btn-dark" onclick="SprawdzenieCzyZaznaczonoSerwer()">Zapisz dane/button></div><br>';
}

function SprawdzenieCzyZaznaczonoPrzeg() {
  if (
    CzyZaznaczono("q1") &&
    CzyZaznaczono("q2") &&
    CzyZaznaczono("q3") &&
    CzyZaznaczono("q4")
  ) {
    var q1 = Number(ZaznaczonaWartosc("q1"));
    var q2 = Number(ZaznaczonaWartosc("q2"));
    var q3 = Number(ZaznaczonaWartosc("q3"));
    var q4 = Number(ZaznaczonaWartosc("q4"));
    var q5 = Number(ZaznaczonaWartosc("q5"));

    answersLocal = [q1, q2, q3, q4, q5];
    addLocalDB();
  } else {
    document.getElementById("mainDiv").innerHTML =
      '<div class="alert alert-info" role="alert">Należy zaznaczyć wszystkie pola przed zapisaniem danych</div>';
  }
}

function SprawdzenieCzyZaznaczonoSerwer() {
  if (
    CzyZaznaczono("q1") &&
    CzyZaznaczono("q2") &&
    CzyZaznaczono("q3") &&
    CzyZaznaczono("q4")
  ) {
    var q1 = Number(ZaznaczonaWartosc("q1"));
    var q2 = Number(ZaznaczonaWartosc("q2"));
    var q3 = Number(ZaznaczonaWartosc("q3"));
    var q4 = Number(ZaznaczonaWartosc("q4"));
    var q5 = Number(ZaznaczonaWartosc("q5"));

    answersLocal = [q1, q2, q3, q4, q5];
    DodajDoBazySerwera(answersLocal);
  } else {
    document.getElementById("mainDiv").innerHTML =
      '<div class="alert alert-info" role="alert">Należy zaznaczyć wszystkie pola przed zapisaniem danych</div>';
  }
}

function CzyZaznaczono(ank_id) {
  var check = document.getElementsByName(ank_id);
  var flag = 0;
  for (var i = 0; i < check.length; i++) {
    if (check[i].checked) {
      flag++;
    }
  }
  return flag != 0;
}

function ZaznaczonaWartosc(ank_id) {
  var val = document.getElementsByName(ank_id);
  for (var i = 0; i < val.length; i++) {
    if (val[i].checked) {
      return val[i].value;
    }
  }
}

var indexedDb =
  window.indexedDB ||
  window.webkitIndexedDB ||
  window.mozIndexedDB ||
  window.msIndexedDB;
var idDbRequest = indexedDb.open("AnkietaLokalna", 3);
var answersLocal = [];
var login_flag = new Boolean(true);
var login_name = "";
var db;

idDbRequest.onupgradeneeded = function (event) {
  db = event.target.result;
  var data = db.createObjectStore("survey", {
    keyPath: "id",
    autoIncrement: true,
  });
  data.createIndex("answers", "answers", { unique: false });
  data.createIndex("date", "date", { unique: false });
};

idDbRequest.onsuccess = function (event) {
  db = event.target.result;
};

function addLocalDB() {
  var data = {};
  data.answers = answersLocal.join([(separator = ",")]);
  data.date = new Date();
  var dbTransaction = db.transaction(["survey"], "readwrite");
  var objStore = dbTransaction.objectStore("survey");
  var objStoreRequest = objStore.add(data);
  objStoreRequest.onsuccess = function (event) {
    answersLocal = [];
    document.getElementById("mainDiv").innerHTML =
      '<div class="alert alert-info" role="alert">Pomyślnie dodano dane do bazy danych po stronie przeglądarki!</div>';
  };
}

function DaneZPrzegladarki() {
  var choices = [];
  var id = [];
  var dbTransaction = db.transaction("survey", "readwrite");
  var objStore = dbTransaction.objectStore("survey");

  objStore.openCursor().onsuccess = function (event) {
    var result = event.target.result;
    if (result) {
      choices[choices.length] = result.value.answers.split(",");
      id[id.length] = result.value.id;
      result.continue();
    } else {
      showLocal(id, choices);
    }
  };
}

function showLocal(id, answ) {
  var data =
    '<table class="table"><tr><th scope="col">Aniekta nr.</th><th scope="col">Pytanie 1(Samopoczucie)</th><th scope="col">Pytanie 2(Sport)</th><th scope="col">Pytanie 3(Leki)</th><th scope="col">Pytanie 4(Fastfoody)</th></tr>';
  for (var i = 0; i < answ.length; i++) {
    data +=
      '<tr><th scope="row">' +
      id[i] +
      "</th><td>" +
      answ[i][0] +
      "</td><td>" +
      answ[i][1] +
      "</td><td>" +
      answ[i][2] +
      "</td><td>" +
      answ[i][3] +
      "</td><td></tr>";
  }
  data += "</table></div>";
  document.getElementById("mainDiv").innerHTML = data;
}

function UsunPlikiLokalne() {
  var dbTransaction = db.transaction("survey", "readwrite");
  var objStore = dbTransaction.objectStore("survey");
  objStore.openCursor().onsuccess = function (event) {
    var result = event.target.result;
    if (result) {
      result.delete();
      result.continue();
    }
  };
}

function UzytkownikZalogowany() {
  OpisProgramu();
  var elements = "";
  elements += '<form name="f1">';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="Wylogowanie(); return false;">Wyloguj się</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="AnkietaSerwer()">Wypełnij ankietę</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="Wykresy()">Wykresy danych</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="DaneZSerwera()">Podgląd danych</button>';
  elements += "</form>";
  document.getElementById("formularz").innerHTML = elements;
}

function UzytkownikNieZalogowany() {
  OpisProgramu();
  var elements = "";
  elements += '<form name="f1">';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="LogowanieDoSerwisu(); return false;">Logowanie</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="RejestraWSerwisie()">Rejestracja</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="AnkietaLokalna()">Wypełnij ankietę</button>  ';
  elements +=
    '<button type="button" class="btn btn-dark" onclick="DaneZPrzegladarki()">Podgląd danych</button>';
  elements += "</form>";
  document.getElementById("formularz").innerHTML = elements;
}

function elementsLoad() {
  UzytkownikNieZalogowany();
}

function ZarejstrujWBazie() {
  var user = {};
  user.login = document.getElementById("reg_log").value;
  user.pass = document.getElementById("reg_pass").value;
  txt = JSON.stringify(user);
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (
      (request.readyState == 4 && request.status == 200) ||
      request.status == 400
    ) {
      var tmp = JSON.parse(request.response);
      document.getElementById("mainDiv").innerHTML =
        '<div class="alert alert-info" role="alert">' + tmp.return + "</div>";
    }
  };
  request.open(
    "POST",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/register",
    true
  );
  request.send(txt);
}

function Wylogowanie() {
  document.getElementById("mainDiv").innerHTML =
    '<div class="alert alert-info" role="alert">Wylogowano ze strony</div>';

  login_flag = false;
  login_name = "";
  UzytkownikNieZalogowany();
}

function DodajDoBazySerwera(answers) {
  var data = {};
  data.date = new Date();

  data.user = login_name;
  data.answers = answers;
  txt = JSON.stringify(data);
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (
      (request.readyState == 4 && request.status == 200) ||
      request.status == 400
    ) {
      var tmp = JSON.parse(request.response);
      document.getElementById("mainDiv").innerHTML +=
        '<div class="alert alert-info" role="alert">' + tmp.return + "</div>";
    }
  };
  request.open(
    "POST",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/add",
    true
  );
  request.send(txt);
}

function PrzeslijDoBazy() {
  var choices = [];

  var dbTransaction = db.transaction("survey", "readwrite");
  var objStore = dbTransaction.objectStore("survey");

  objStore.openCursor().onsuccess = function (event) {
    var result = event.target.result;
    if (result) {
      var tmp = result.value.answers.split(",");
      for (var i = 0; i < tmp.length; i++) {
        tmp[i] = new Number(tmp[i]);
      }
      choices[choices.length] = tmp;
      result.continue();
    } else {
      if (choices.length != 0) {
        for (var i = 0; i < choices.length; i++) {
          DodajDoBazySerwera(choices[i]);
        }
        UsunPlikiLokalne();
      }
    }
  };
}

function OdczytZBazy() {
  var index = [];
  var chosen = [];
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      for (var id in objJSON) {
        index[id] = id;
        chosen[id] = JSON.stringify(objJSON[id]["answers"]).split(",");
      }
      var data =
        '<table  class="table"><tr><th scope="col">Aniekta nr.</th><th scope="col">Pytanie 1(Samopoczucie)</th><th scope="col">Pytanie 2(Sport)</th><th scope="col">Pytanie 3(Leki)</th><th scope="col">Pytanie 4(Fastfoody)</th></tr>';

      for (var i = 0; i < chosen.length; i++) {
        data +=
          '<tr><th scope="row">' +
          index[i] +
          "</th><td>" +
          chosen[i][0].split("[")[1] +
          "</td><td>" +
          chosen[i][1] +
          "</td><td>" +
          chosen[i][2] +
          "</td><td>" +
          chosen[i][3] +
          "</td><td></tr>";
      }
      data +=
        "Wyniki przedstawione w tabeli. 1 to wartośc najmniejsza, 5 to wartośc maksymalna";
      data += "</table>";

      document.getElementById("mainDiv").innerHTML = data;
    }
  };
  request.open(
    "GET",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/read",
    true
  );
  request.send(null);
}

function DaneZSerwera() {
  var idx = [];
  var choices = [];
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      for (var id in objJSON) {
        idx[id] = id;
        choices[id] = JSON.stringify(objJSON[id]["answers"]).split(",");
      }
      TabelDaneZSerwera(idx, choices);
    }
  };
  request.open(
    "GET",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/read",
    true
  );
  request.send(null);
}

function TabelDaneZSerwera(id, answ) {
  var data =
    '<table   class="table"><tr><th scope="col">Aniekta nr.</th><th scope="col">Pytanie 1(Samopoczucie)</th><th scope="col">Pytanie 2(Sport)</th><th scope="col">Pytanie 3(Leki</th><th scope="col">Pytanie 4(Fastfoody)</th></tr>';
  for (var i = 0; i < answ.length; i++) {
    data +=
      '<tr><th scope="row">' +
      id[i] +
      "</th><td>" +
      answ[i][0].split("[")[1] +
      "</td><td>" +
      answ[i][1] +
      "</td><td>" +
      answ[i][2] +
      "</td><td>" +
      answ[i][3].split("]")[0] +
      "</td></tr>";
  }
  data +=
    "Wyniki przedstawione w tabeli. 1 to wartośc najmniejsza, 5 to wartośc maksymalna";
  data += "</table>";
  document.getElementById("mainDiv").innerHTML = data;
}

function Wykresy() {
  var choices = [];
  request = getRequestObject();
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      for (var id in objJSON) {
        choices[id] = JSON.stringify(objJSON[id]["answers"]).split(",");
      }

      var count = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];
      for (var i = 0; i < choices.length; i++) {
        for (var j = 0; j < choices[i].length; j++) {
          if (j == 0) {
            var idx = choices[i][j].split("[")[1];
            count[j][new Number(idx) - 1] += 1;
          } else if (j == choices[i].length - 1) {
            var idx = choices[i][j].split("]")[0];
            count[j][new Number(idx) - 1] += 1;
          } else {
            count[j][new Number(choices[i][j]) - 1] += 1;
          }
        }
      }
      document.getElementById("mainDiv").innerHTML =
        '<canvas id="canv1"></canvas>';
      canv1 = document.getElementById("canv1");
      canv1.width = 0.8 * window.innerWidth;
      canv1.height = 400;
      context = canv1.getContext("2d");
      context.strokeStyle = "#FF0000";
      var maxh = WykresGornaWartosc(count);
      var pos = canv1.width / 6;
      if (maxh != 0) {
        RysujWykres(
          canv1,
          context,
          count[0],
          canv1.height / maxh,
          pos,
          "Samopoczucie"
        );
        RysujWykres(
          canv1,
          context,
          count[1],
          canv1.height / maxh,
          2 * pos,
          "Sport"
        );
        RysujWykres(
          canv1,
          context,
          count[2],
          canv1.height / maxh,
          3 * pos,
          "Leki na ból głowy"
        );
        RysujWykres(
          canv1,
          context,
          count[3],
          canv1.height / maxh,
          4 * pos,
          "Fast foody"
        );
      } else {
        RysujWykres(canv1, context, count[0], 0, pos, "Ocena snu");
        RysujWykres(canv1, context, count[1], 0, 2 * pos, "Ocena posilku");
        RysujWykres(canv1, context, count[2], 0, 3 * pos, "Ocena filmu");
        RysujWykres(canv1, context, count[3], 0, 4 * pos, "Ocena serialu");
      }
      context.stroke();
    }
  };
  request.open(
    "GET",
    "http://pascal.fis.agh.edu.pl/~9nizio/proj2/rest/read",
    true
  );
  request.send(null);
}

function WykresGornaWartosc(table) {
  var maxh = 0;
  for (var i = 0; i < table.length; i++) {
    for (var j = 0; j < table[i].length; j++) {
      if (table[i][j] > maxh) {
        maxh = table[i][j];
      }
    }
  }
  return maxh;
}

function RysujWykres(obszar, ctx, data, ratio, position, title) {
  ctx.fillStyle = "red";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(title, position - 30, obszar.height - 10);

  var start = position - 70;
  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(start + i * 30, obszar.height - 20, 20, -data[i] * ratio);
    ctx.fillStyle = "white";
    ctx.fillText(i + 1, start + i * 30 + 10, obszar.height - 25);
  }
}
