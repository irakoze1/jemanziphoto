//My stle of filtiling

const list = document.querySelectorAll('.list');
const itemBox = document.querySelectorAll('.itemBox');

list.forEach((item) => {
  item.addEventListener('click', (e)=>{
    list.forEach((subItem) => {
      if(e.target == subItem){subItem.classList.add('active')}
      else{subItem.classList.remove('active')}
    })
	  itemBox.forEach((item) => {
	  	 if(e.target.id == 'All'){
         item.classList.remove("hideImage");
	  	 }
	     else if(item.classList.contains(e.target.id)){
         item.classList.remove("hideImage");
	     }else{
         item.classList.add("hideImage");
	     }
	  });
  });
});

  //Image Full Screen Window

  const fullScreenImgBody = document.querySelector('.fullScreenImgBody');
  const fullSingleImage = document.querySelector('.fullScreenImgBody img');
  const img = document.querySelectorAll('.galleryImg');
  const closeFullScreen = document.querySelector('.closeFullScreen');
  let headerSticky = ''
  let currentImage = '';

  img.forEach(item => {
    item.addEventListener('click', (e) => {
      headerSticky = document.querySelector('.sticky');
      if(headerSticky){
        headerSticky.style.visibility = 'hidden';
      }

      fullScreenImgBody.style.position = 'fixed';
      fullScreenImgBody.style.visibility = 'visible';
      fullSingleImage.style.visibility = 'visible';
      fullSingleImage.src = e.target.src;

      if(e.target == img[0]){
         leftArrow.classList.add('hideEveryThing');
         rightArrow.classList.remove('hideEveryThing'); 
        }

      else if(e.target == img[img.length-1]){
         rightArrow.classList.add('hideEveryThing');
         leftArrow.classList.remove('hideEveryThing'); 
        }

      else{
        leftArrow.classList.remove('hideEveryThing');
        rightArrow.classList.remove('hideEveryThing');
      }

      currentImage = e.target;
    });
  });

  closeFullScreen.addEventListener('click', (e) =>{
      fullScreenImgBody.style.position = 'relative';
      fullScreenImgBody.style.visibility = 'hidden';
      fullSingleImage.style.visibility = 'hidden';
      headerSticky.style.visibility = 'visible';
  });

  /*fullScreenImgBody.addEventListener('click', (e) => {
    if(e.target != fullSingleImage){
      fullScreenImgBody.style.position = 'relative';
      fullScreenImgBody.style.visibility = 'hidden';
      fullSingleImage.style.visibility = 'hidden';
      headerSticky.style.visibility = 'visible';
    }
  })*/


 // Customize input

 const fileInput = document.createElement('input');
 const btn = document.getElementById('addFile-btn');
 const form = document.getElementById('AddImage');
 const GallerySelect = document.getElementById('Gallery');
 const fileSubmit = document.querySelector('.fileSubmit');

 fileInput.type = "file";
 fileInput.name = "image";
 fileInput.className = "input-style";

 //activating or Desactivating AddFile btn

let checkingAdmin;
 if(btn == null){
   checkingAdmin = false;
 }else{
   checkingAdmin = true;
 }

 if(checkingAdmin){
    btn.addEventListener('click', (e)=>{
      fileInput.click();
      form.appendChild(fileInput);
      btn.classList.add('input-style');
      GallerySelect.classList.remove('input-style');
      fileSubmit.classList.remove('input-style');
    });

    fileSubmit.addEventListener('click', (e)=>{
      btn.classList.remove('input-style');
      GallerySelect.classList.add('input-style');
      fileSubmit.classList.add('input-style');
    });
 }

 // Delete Btn

 const delBtn = document.querySelectorAll('#delBtn');
 const product = document.querySelector('.product');

 if(checkingAdmin){
    delBtn.forEach(btn => {
      btn.addEventListener('click', (e) => {
          console.log(e.target.dataset.doc);
          e.target.parentElement.classList.add('ok');
          fetch('/upload/' + e.target.dataset.doc, {
                method: 'DELETE'
                })
          .then((response) => response.json())
          .then((data) => {
          product.removeChild(e.target.parentElement);
          //window.location.href = data.redirect
          })
          .catch((err) => console.log(err))

      });
    });
}

 
 // Right Arrow And Left Arrow

 const rightArrow = document.getElementById('Rarrow');
 const leftArrow = document.getElementById('Larrow');
 let temp = 0;

 rightArrow.addEventListener('click', (e) => {
      let max = img.length - 1;
      
      if(currentImage == img[0]){leftArrow.classList.remove('hideEveryThing')}
      
      for(i = 0 ; i < img.length ; i++){
        if(img[i] == currentImage){
            temp = 0;
            temp = i + 1;
            if(temp == max){ rightArrow.classList.add('hideEveryThing') }
        }
      }
      currentImage = img[temp];
      fullSingleImage.src = currentImage.src;
      console.log('okoooo');
 });

 leftArrow.addEventListener('click', (e) => {

  if(currentImage == img[img.length-1]){ rightArrow.classList.remove('hideEveryThing') }

  for(i = 0 ; i < img.length ; i++){
    if(img[i] == currentImage){
        temp = 0;
        temp = i - 1;
        if(temp == 0){ leftArrow.classList.add('hideEveryThing') }
    }
  }
  currentImage = img[temp];
  fullSingleImage.src = currentImage.src;
  console.log('okoooo');
})
 

// Pagination

const productSection = document.querySelectorAll('.productSection');
const boxNmbr = document.querySelectorAll('.boxNmbr');
let currentPagination = '';

     //initializing all products to display none
     //and let first to display block
for(i=2 ; i<=boxNmbr.length; i++){
  document.getElementById(`productSct${i}`).style.display = 'none';
}
    //initializing the first box to active
boxNmbr[0].classList.add('boxActive');

boxNmbr.forEach(item => {
  item.addEventListener('click', (e) => {
    
      for(i=1 ; i<=boxNmbr.length; i++){
        document.getElementById(`productSct${i}`).style.display = 'none';
      }
      boxNmbr.forEach(item =>{
        item.classList.remove('boxActive');
      })

      document.getElementById(`productSct${e.target.dataset.boxnmbr}`).style.display = 'block';
      currentPagination = document.getElementById(`productSct${e.target.dataset.boxnmbr}`);
      e.target.classList.add('boxActive');
  })
})

//pagination arrows 

/*const minArrow = document.getElementById('minArrow');
const maxArrow = document.getElementById('maxArrow');

maxArrow.addEventListener('click', (e) => {
      let max = productSection.length - 1;
      let precedent = 0;
          
      //if(currentPagination == img[0]){leftArrow.classList.remove('hideEveryThing')}
      
      for(i = 0 ; i < productSection.length ; i++){
        if(productSection[i] == currentPagination){
            precedent = 0;
            precedent = i + 1;
            if(precedent == max){ maxArrow.style.display = 'none' }
        }
      }
      for(i=1 ; i<=productSection.length; i++){
        document.getElementById(`productSct${i}`).style.display = 'none';
      }
      currentPagination = productSection[precedent];
      currentPagination.style.display = 'block';
      console.log('okoooo');
})

minArrow.addEventListener('click', () => {
  for(i = 0 ; i < productSection.length ; i++){
    if(productSection[i] == currentImage){
        temp = 0;
        temp = i - 1;
        if(temp == 0){ minArrow.style.display = 'none' }
    }
  }
  for(i=1 ; i<=productSection.length; i++){
    document.getElementById(`productSct${i}`).style.display = 'none';
  }
  currentPagination = productSection[temp];
  currentPagination.style.display = 'block';
  console.log('okoooo');
})
*/


