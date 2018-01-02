function getData(url){
  return new Promise(function(resolve, reject){
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => (req.status == 200 && req.status < 300) ? resolve(req.response) : reject({status: req.status, statusText: req.statusText});    
    req.onerror = () => reject({status: req.status, statusText: req.statusText});
    req.send();
  });
}

function loadProducts() {
  getData('http://api.cewe-community.com/v2/products').then(function(res){	  
	  let products = JSON.parse(res);
	  let tmpl = products.data.products.length + ' Produkte wurden geladen!';	  
	  saveToLS(JSON.stringify(products.data.products));
	  document.getElementById('template').innerHTML = tmpl;
	}).catch(function(err){
	  let tmpl = `
	  	Fehler: ${err.statusText}!
	  `;
	  document.getElementById('template').innerHTML = tmpl;
	});
}

function saveToLS(products) {
	localStorage.setItem('products', products);
}

function findProduct() {
	let p_id = document.getElementById('p_id').value;

	if(p_id == "") {
		let tmpl = `
	  	Fehler: Bitte geben Sie ein Produkt-ID!
	  `;
	  document.getElementById('template').innerHTML = tmpl;
		return false;
	}

	let products = JSON.parse(localStorage.getItem("products"));	

	let tmpl = ``;

  let product = products.find(p => p.ID === p_id);
  if(product) {
	  tmpl += `
	    Ergebnis für Produkt: ${p_id}
	    <br />
	    <h3>${product.Title}</h3>
	    <p>Erstellt am ${product.Created} von ${product.UserName} (UserID: ${product.UserID})</p>
	    <p><img src=${product.CoverURL} /></p>	     
	  `;
	}
	else {
		tmpl += `
	  	Fehler: Produkt ${p_id} konnte nicht gefunden werden!
	  `;
	}

  document.getElementById('template').innerHTML = tmpl;
  return true;
}