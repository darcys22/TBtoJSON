function handleFiles(event) {
	loadBinaryFile(event,function(data){
		var workbook = XLSX.read(data,{type:'binary'});
		alert(workbook.SheetNames);
	});
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
