// Source: https://gist.github.com/koljanep/4652b14f8daaf316fabe

function number_format(number, decimals, decPoint, thousandsSep){
	decimals = decimals || 0;
	number = parseFloat(number);

	if(!decPoint || !thousandsSep){
		decPoint = '.';
		thousandsSep = ',';
	}

	var roundedNumber = Math.round( Math.abs( number ) * ('1e' + decimals) ) + '';
	// add zeros to decimalString if number of decimals indicates it
	roundedNumber = (1 > number && -1 < number && roundedNumber.length <= decimals)
		      ? Array(decimals - roundedNumber.length + 1).join("0") + roundedNumber
		      : roundedNumber;
	var numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber.slice(0);
	var checknull = parseInt(numbersString) || 0;
  
	// check if the value is less than one to prepend a 0
	numbersString = (checknull == 0) ? "0": numbersString;
	var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
	
	var formattedNumber = "";
	while(numbersString.length > 3){
		formattedNumber += thousandsSep + numbersString.slice(-3)
		numbersString = numbersString.slice(0,-3);
	}

	return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
}


//Source: StackOverflow
//http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript

function pad(n,w){
    var n_ = Math.abs(n);
    var zeros = Math.max(0, w - Math.floor(n_).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( n < 0 ) {
        zeroString = '-' + zeroString;
    }
    return zeroString+n;
}
