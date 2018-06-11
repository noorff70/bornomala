/**
 * 
 */

  var jsonImageNode = document.getElementById("id_image");

  if (jsonImageNode != null) {
	  var jsonImage = document.getElementById("id_image").value;
	  jsonImage = jsonImage.substr(1);
	  jsonImage = jsonImage.slice(0, -1)


	  mpld3.draw_figure("image", JSON.parse(jsonImage));
  } 
