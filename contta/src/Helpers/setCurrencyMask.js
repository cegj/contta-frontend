const setCurrencyMask = (value, setValue) => {

  function reverse(string){
    return string.split('').reverse().join(''); 
  }

    if(value && value.length !== 0){
      const v = value;
      let valor  = reverse(v.replace(/[^\d]+/gi,''));
      var resultado  = "";
      let mascara = reverse("##.###.###,##");
      for (let x=0, y=0; x<mascara.length && y<valor.length;) {
        if (mascara.charAt(x) !== '#') {
          resultado += mascara.charAt(x);
          x++;
        } else {
          resultado += valor.charAt(y);
          y++;
          x++;
        }
    }
    return setValue(reverse(resultado))
    } else {
      return value;
    }
  }

export default setCurrencyMask