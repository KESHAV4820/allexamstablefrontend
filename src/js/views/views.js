//SuperNoteVIE:becouse we are using babal and parcle, they aren't yet compatible with # or private field for variable or method. Hence, at the last moment i had to manually change all the private field according to ES6 standard into the _ comventionally accepted private field😢. Sad life.


export default class View{
    _data;//protected variable to inherited
 
  render(data, render=true){
    /*//CHECK IF DATA EXIST
    if(!data || (Array.isArray(data)&&data.length===0)) return this.renderError();//it's guard claus to check if data has value or even the empty array. In both the case, control has to be guarded.*/

    this._data = data;
  //  console.log(data,this._data);//Code Testing
    const markup = this._generateMarkup();// Every child will have it's own _generateMarkup() becouse parant class View.js uses this method and doesn't define it inhouse so that polymorphism can be implemented.
    if(!render) return markup;//SuperConcept: so that when we need markup as string, we can simply pass the function render() with second parameter as 'false' and becouse of this code setup, we shall leakout the code.
    this._clear();//Clears any prexisting code before pushing any new code could happen.
    this._parentElement.insertAdjacentHTML('afterbegin',markup);
    };
  
  domUpdatingAlgo(data){
    /* SuperConcept:-
    1️⃣ To find out the changes that has been induced in a copy of data, you need to have a mirror copy to see the possible changes or corruption induced in one of the file against the pure one. Similarly, to see the changes that has been introduced to the currentDOM uploaded in the page, we shall need to make an updated DOM that will not be uploaded in the page at the place of currentDOM, but simply in our memory to make comparison.  
    2️⃣current DOM has the olddata, uploaded in page that existed before the changes were induced by the user. 
    3️⃣updatedDOM is the DOM that ins't visible as it isn't uploaded in the page, but it is there in memory for the comparison shake. UpdatedDOM actually contains the virtual DOM which has been generated with recent changes induced by user.
    4️⃣Ultimately, these changes shall be compared with the original or currentDOM to find the changed material that we seek to use and then these changes are processed to finally copy on the currentDOM and make the changes tha are visible on the DOM
    5️⃣Becouse of this, the reloading of the views isn't required.
    6️⃣SuperNote:👉'document.createRange().createContextualFragment(markuphavingHTML)' command is used to create this virtual DOM in memory.All the operation that we can do on realDOMs can also be done on Virtual DOMs.
    7️⃣SuperNote:👉virtualDOM.querySelectorAll('*'); will select all the elements present in the virtualDOM.It will give us a "NodeList" of entire VirtualDOM.Here you can see the changes that are meant to be reflected on the realDOM.It's becouse, these were changes that would have got rendered if render() was simply used. This will help us better compare as comparing between string of HTML is a bad idea. To better operate, we will need to convert nodelist into array and that we can do by using Array.from() like Array.from(virtualDOM.querySelectorAll('*'));
    8️⃣Each element in the array/node of currentElement is compared with elements of newElements using a very important method which is 'isEqualNode()'. However, there is a problem with this method. It compares the contents of the node attached to it on either side like eachNewElement and eachCurrentElement.Note It doesn't have to be exact same node but the contents in these nodes have to be same. Becouse of this, it doesn't reflects the changes made on other attributes of the node and hence, when copying these changes to realDOM, other attributes also changes. But these change aren't registered; only the text content of the node is registered, hence these changes that were made on attributes aren't copied and hence, when this code is updated, the whole container property may appear changed. To achieve this, we need to use yet another fantastic method👇
    9️⃣To select only those elements which are text, we need to use "nodeValue()" which is equal to text content on a node if that node contained text.If it doesn't have text, than it is empty string ''. 
    🔟firstChild:- in Advance DOM section we had studied this. At this node, there are many child elements of this element. In our case, firstChild is the one that contains text and we are looking for it to use in our Code, hence used nodeValue() method on this firstChild. trim() is used to remove any extra whitespaces.
    */
    // if(!data || (Array.isArray(data)&&data.length===0)) return this.renderError();//No need, since the update will happen only if there was data before it, and will remain after it.
    this._data = data;
  //  console.log(data,this._data);//Code Testing
    const domUpdatingMarkup = this._generateMarkup();

    const newDOM=document.createRange().createContextualFragment(domUpdatingMarkup);
    const newElements= Array.from(newDOM.querySelectorAll('*'));
    const curElements=Array.from(this._parentElement.querySelectorAll('*'));
  //  console.log(newElements);//Code Testing
   // console.log(curElements);//Code Testing
    newElements.forEach((eachNewElement,id)=>{
      const eachCurrentElement=curElements[id];
    //    console.log(eachCurrentElement,eachNewElement.isEqualNode(eachCurrentElement));//Code Testing

      if(!eachNewElement.isEqualNode(eachCurrentElement) && eachNewElement.firstChild?.nodeValue.trim() !==''){//this code executes on elements that contains the text directly.
    //    console.log(`just to understand🕵️‍♀️ this code: ${eachNewElement.firstChild?.nodeValue.trim()}`);//Code Testing
        eachCurrentElement.textContent=eachNewElement?.textContent;
      };
      //changing the attributes when the eachNewElement element is different from eachCurrentElement:-👇
      if(!eachNewElement.isEqualNode(eachCurrentElement)){
    //    console.log(`💃💃 ${eachNewElement.attributes} ${Array.from(eachNewElement.attributes)}`);//Remember It: '.attributes' method will show all the elements whose attributes have changed.It will show use these attributes saved as Array in the other statement.
      Array.from(eachNewElement.attributes).forEach(
        elem=>eachCurrentElement.setAttribute(elem.name,elem.value)//LearnByHeart:'.setAttribute()' method is used to assign new attribute values.
        );
      };
    })
  };
    _clear(){this._parentElement.innerHTML='';};//keeps the search field clear

    renderSpinner(){
        const codeToInsert=`
                <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
            `;
          //  this._parentElement.innerHTML='';
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin',codeToInsert);
      };

   /* renderError(message=this._errorMessage){
        const markup =`
              <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin',markup);
      };*/

   /* renderSuccessMsg(message=this._successmsg){
        const markup =`
              <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin',markup);
      };*/
};// Here we are exporting the class itself becouse we aren't going make any instace of this class. We are going to use this class as parent class for other views.
