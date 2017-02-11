function handleFiles(event) {
	loadBinaryFile(event,function(data){
		var workbook = XLSX.read(data,{type:'binary'});
		window.rows = [];
		window.columns = [];
    window.csv = Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]));
    var body = document.getElementById("mappertable");
    var tbl = document.createElement('table');
    tbl.className = 'table';
    var tbdy = document.createElement('tbody');
    var thead = document.createElement('thead');
    var th = document.createElement('th');
    thead.appendChild(th);
    for (i = 0; i < window.csv.data[0].length; i++) {
      columns[i] = '';
      var th = document.createElement('th');
      th.className = 'dropdown';
      var button = document.createElement('button');
      button.type="button";
      button.id="c" + i;
      button.className = 'btn btn-default btn-sm dropdown-toggle';
      button.setAttribute('data-toggle',"dropdown");
      button.innerHTML = 'Ignore Column <span class="caret"></span>'
      var ul = document.createElement('ul');
      ul.className = 'dropdown-menu';
      ul.innerHTML = `
                      <li><a href="#" id="">Ignore Column</a></li>
                      <li><a href="#" id="Account">Account Description</a></li>
                      <li><a href="#" id="Account_Number">Account Number</a></li>
                      <li><a href="#" id="other">Other</a></li>
                      <li role="separator" class="divider"></li>
                      <li><a href="#" id="debit">Debits</a></li>
                      <li><a href="#" id="credit">Credits</a></li>
                      <li><a href="#" id="negcredit">Negative Credits</a></li>
                      <li><a href="#" id="value">Debits & Credits</a></li>`


      th.appendChild(button);
      th.appendChild(ul);
      thead.appendChild(th);
    }
    tbl.appendChild(thead);
    for (i = 0; i < window.csv.data.length; i++) {
      rows[i] = true;
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      var input = document.createElement('input');
      input.type="checkbox";
      input.setAttribute('checked',true);
      input.id=i;
      input.addEventListener("click", function(){toggleRow(this.id)}, false);
      td.appendChild(input);
      tr.appendChild(td);
      for (j = 0; j < window.csv.data[i].length; j++) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(window.csv.data[i][j]));
        tr.appendChild(td);
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
    $("#panel").removeClass('hidden');
    $("#dateselector").removeClass('hidden');
    $('ul.dropdown-menu li a').click(function (e) {
      var $div = $(this).parent().parent().parent(); 
      var $btn = $div.find('button');
      $btn.html($(this).text() + ' <span class="caret"></span>');
      $div.removeClass('open'); 
      addColumn($btn.attr('id'), this.id);
      e.preventDefault();
      return false;
    }); 
    var convertButton= document.getElementById("convert");
    convertButton.classList.remove('disabled');
    convertButton.classList.remove('disabled');
    convertButton.addEventListener("click", function(){convert()}, false);
	});
}

function toggleRow(path) {
  window.rows[path] = !window.rows[path];
}

function addColumn(column = window.column, desc) {
  if (desc == "other") {
    window.column = column;
    $('#otherModal').modal('show');
  } else {
    window.columns[parseInt(column.slice(1))] = desc;
  }
}
function convert() {
  var balance = 0;
  var filtered = window.csv.data.filter(function(x) {
    return window.rows[window.csv.data.indexOf(x)]
  });

  var jsontb = {"Prot":"Journal","Txn":{"Payee":"Import TB:","Date":window.userDate,"Postings":[]}}

//{"Account":"Asset.Cash","Amt":{"Value":"1000","Cur":"AUD"}}

  for (var row in filtered) {
    var posting = {};
    for (i = 0; i < filtered[row].length; i++) {
      var value = 0;
      console.log(window.columns[i]);
      switch(window.columns[i]) {
          case "":
              break;
          case "debit":
              value += parseInt(filtered[row][i]); 
              break;
          case "credit":
              value -= parseInt(filtered[row][i]);
              break;
          case "negcredit":
              value += parseInt(filtered[row][i]);
              break;
          case "value":
              value = parseInt(filtered[row][i]);
              break;
          default:
              posting[window.columns[i]] = filtered[row][i];
      }
    }
    balance += value;
    posting["Amt"] = {"Value": value, "Cur":"AUD"}
    jsontb["Txn"]["Postings"].push(posting)
  }
  $('#tbbalance-info').html("Balance: " + balance);

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsontb));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", "trialBalance.json");
  dlAnchorElem.click();


  console.log(jsontb);
  console.log(balance);
}

function loadBinaryFile(path, success) {
	var files = path.target.files;
	var reader = new FileReader();
	var name = files[0].name;
  $('#upload-file-info').html(name);
	reader.onload = function(e) {
			var data = e.target.result;
			success(data);
	};
	reader.readAsBinaryString(files[0]);
}

function main() {
  window.userDate = new Date;
  var picker = new Pikaday({ field: document.getElementById('datepicker'),
      onSelect: function(date) {
          window.userDate = picker.toString();
      },
    defaultDate: new Date(),
    setDefaultDate: true
  });
}
main();
