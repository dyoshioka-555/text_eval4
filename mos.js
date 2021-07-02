Array.prototype.shuffle = function () {
  var i = this.length;
  while (i) {
    var j = Math.floor(Math.random() * i);
    var t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
}

// invalid enter key
function invalid_enter() {
  if (window.event.keyCode == 13) {
    return false;
  }
}

// start experiment
function start_experiment() {
  // get user name
  var name = document.getElementById("name").value.replace(" ", "_");
  if (name == "") {
    alert("Please enter your name.");
    return false;
  }

  // get setlist number
  var set_num = "0"
  var number = document.getElementsByName("set");
  for (var i = 0; i < number.length; i++) {
    if (number[i].checked) {
      set_num = number[i].value;
    }
  }
  if (set_num == "0") {
    alert("Please press the setlist number button.");
    return false;
  }

  // convert display
  Display();

  // read filepath
  var origin_list = text_dir + "set" + set_num + "/origin.list";
  var method1_list = text_dir + "set" + set_num + "/cvae.list";
  var method2_list = text_dir + "set" + set_num + "/cvae_bow.list";
  //var method3_list = text_dir + "set" + set_num + "/cvae2.list";
  //var method4_list = text_dir + "set" + set_num + "/cvae_bow2.list";
  origin = loadText(origin_list);
  method1 = loadText(method1_list);
  method2 = loadText(method2_list);
  //method3 = loadText(method3_list);
  //method4 = loadText(method4_list);
  outfile = name + "_set" + set_num + ".csv";
  text_list = makeTextList();
  console.log(text_list);
  scores1 = (new Array(text_list.length)).fill(0);
  scores2 = (new Array(text_list.length)).fill(0);
  scores3 = (new Array(text_list.length)).fill(0);
  eval1 = document.getElementsByName("eval1");
  eval2 = document.getElementsByName("eval2");
  eval3 = document.getElementsByName("eval3");
  init()

}

// convert display
function Display() {
  document.getElementById("Display1").style.display = "none";
  document.getElementById("Display2").style.display = "block";
}

// load text file
function loadText(filename) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", filename, false);
  xhr.send(null);
  var list = xhr.responseText.split(/\r\n|\r|\n/);
  list.pop();

  return list;
}

// make file list
function makeTextList() {
  var m1_id_text = {};
  var m1_texts = [];
  for (i = 0; i < origin.length; i++) {
    m1_id_text.id = i;
    m1_id_text.method = "cvae";
    m1_id_text.ori_text = origin[i];
    m1_id_text.tra_text = method1[i];
    m1_texts.push(m1_id_text);
  }
  var m2_id_text = {};
  var m2_texts = [];
  for (i = 0; i < origin.length; i++) {
    m2_id_text.id = i;
    m1_id_text.method = "cvae+bow";
    m2_id_text.ori_text = origin[i];
    m2_id_text.tra_text = method2[i];
    m2_texts.push(m2_id_text);
  }
  var texts = [];
  texts = m1_texts.concat(method2);//, method3, method4
  texts.shuffle();
  return texts;
}

function SetText() {
  document.getElementById("page").textContent = "" + (n + 1) + "/" + scores1.length;

  document.getElementById("ori_text").innerHTML = text_list[n]["ori_text"];
  document.getElementById("tra_text").innerHTML = text_list[n]["tra_text"];
}

function init() {
  n = 0;
  SetText();
  evalCheck1();
  evalCheck2();
  evalCheck3();
  setButton();
}

function evalCheck1() {
  const c = scores1[n];
  if ((c <= 0) || (c > eval1.length)) {
    for (var i = 0; i < eval1.length; i++) {
      eval1[i].checked = false;
    }
  }
  else {
    eval1[c - 1].checked = true;
  }
}
function evalCheck2() {
  const c = scores2[n];
  if ((c <= 0) || (c > eval2.length)) {
    for (var i = 0; i < eval2.length; i++) {
      eval2[i].checked = false;
    }
  }
  else {
    eval2[c - 1].checked = true;
  }
}
function evalCheck3() {
  const c = scores3[n];
  if ((c <= 0) || (c > eval3.length)) {
    for (var i = 0; i < eval3.length; i++) {
      eval3[i].checked = false;
    }
  }
  else {
    eval3[c - 1].checked = true;
  }
}

function setButton() {
  var finish_flag = 0;
  var next_flag = 0;
  if (n == (scores1.length - 1)) {
    document.getElementById("prev").disabled = false;
    document.getElementById("next2").disabled = true;
    document.getElementById("finish").disabled = true;
    for (var i = 0; i < eval1.length; i++) {
      if (eval1[i].checked) {
        finish_flag += 1;
      }
      if (eval2[i].checked) {
        finish_flag += 1;
      }
      if (eval3[i].checked) {
        finish_flag += 1;
      }
      if (finish_flag >= 3) {
        document.getElementById("finish").disabled = false;
        break;
      }
    }
  }
  else {
    if (n == 0) {
      document.getElementById("prev").disabled = true;
    }
    else {
      document.getElementById("prev").disabled = false;
    }
    document.getElementById("next2").disabled = true;
    document.getElementById("finish").disabled = true;
    for (var i = 0; i < eval1.length; i++) {
      console.log(next_flag);
      if (eval1[i].checked) {
        next_flag += 1;
      }
      if (eval2[i].checked) {
        next_flag += 1;
      }
      if (eval3[i].checked) {
        next_flag += 1;
      }
      if (next_flag >= 3) {
        document.getElementById("next2").disabled = false;
        break;

      }
      console.log(next_flag);
    }
  }
}

function evaluation(k) {
  for (var i = 0; i < eval1.length; i++) {
    switch (k) {
      case 1:
        if (eval1[i].checked) {
          scores1[n] = i + 1;
        }
        break;
      case 2:
        if (eval2[i].checked) {
          scores2[n] = i + 1;
        }
        break;
      case 3:
        if (eval3[i].checked) {
          scores3[n] = i + 1;
        }
        break;
    }
  }
  setButton();
}

function exportCSV() {
  var csvData = "";
  for (var i = 0; i < text_list.length; i++) {
    csvData += "" + text_list[i]["method"] + "_"
      + text_list[i]["id"] + ","
      + scores1[i] + ","
      + scores2[i] + ","
      + scores3[i] + "\r\n";
  }

  const link = document.createElement("a");
  document.body.appendChild(link);
  link.style = "display:none";
  const blob = new Blob([csvData], { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = outfile;
  link.click();
  window.URL.revokeObjectURL(url);
  link.parentNode.removeChild(link);
}

function next() {
  n++;
  SetText();
  evalCheck1();
  evalCheck2();
  evalCheck3();
  setButton();
}

function prev() {
  n--;
  SetText();
  evalCheck1();
  evalCheck2();
  evalCheck3();
  setButton();
}

function finish() {
  exportCSV();
}


// --------- 設定 --------- //

// directory name
const text_dir = "texts/";
var keyCode = false;

// invalid enter key
document.onkeypress = invalid_enter();

var origin;
var method1;
var method2;
//var method3;
//var method4;
var outfile;
var text_list;
var scores1;
var scores2;
var scores3;

// ローカルで行う場合はloadText()は動作しないため
var n = 0;
var eval1 = document.getElementsByName("eval1");
var eval2 = document.getElementsByName("eval2");
var eval3 = document.getElementsByName("eval3");