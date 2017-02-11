function handleFiles(event) {
	loadBinaryFile(event,function(data){
		var workbook = XLSX.read(data,{type:'binary'});
		window.rows = [];
		window.columns = [];
    var csv = Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]));
    var body = document.getElementById("mappertable");
    var tbl = document.createElement('table');
    tbl.className = 'table';
    var tbdy = document.createElement('tbody');
    var thead = document.createElement('thead');
    var th = document.createElement('th');
    thead.appendChild(th);
    for (i = 0; i < csv.data[0].length; i++) {
      columns[i] = '';
      var th = document.createElement('th');
      th.className = 'dropdown';
      var button = document.createElement('button');
      button.type="button";
      button.className = 'btn btn-default btn-sm dropdown-toggle';
      button.setAttribute('data-toggle',"dropdown");
      button.innerHTML = 'Map Column <span class="caret"></span>'
      var ul = document.createElement('ul');
      ul.className = 'dropdown-menu';
      ul.innerHTML = `
                      <li><a href="#">Account Description</a></li>
                      <li><a href="#">Account Number</a></li>
                      <li><a href="#">Other</a></li>
                      <li role="separator" class="divider"></li>
                      <li><a href="#">Debits</a></li>
                      <li><a href="#">Credits</a></li>
                      <li><a href="#">Negative Credits</a></li>
                      <li><a href="#">Debits & Credits</a></li>`
      th.appendChild(button);
      th.appendChild(ul);
      thead.appendChild(th);
    }
    tbl.appendChild(thead);
    for (i = 0; i < csv.data.length; i++) {
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
      for (j = 0; j < csv.data[i].length; j++) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(csv.data[i][j]));
        tr.appendChild(td);
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
    $("#panel").removeClass('hidden');
	});
}

function toggleRow(path) {
  window.rows[path] = !window.rows[path];
  //row = document.getElementById(path);
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
}
main();
