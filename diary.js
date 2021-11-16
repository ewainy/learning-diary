const main = document.getElementById("main")
const email = document.getElementById('email')
const password = document.getElementById('password')

// authentication

// login 
const login = document.getElementById('login')

login.addEventListener('click', (e) => {
  e.preventDefault()

  auth.signInWithEmailAndPassword(email.value, password.value)
.then(cred=> {
 console.log(cred)
 
})

})

// logout
const logout = document.getElementById("logout");

logout.addEventListener('click', (e) => {
  e.preventDefault()

auth.signOut().then(() => {
  console.log("User logged out")

})

//clear input fields on logout
email.value = null;
password.value = null;

})


///////// real time update 
database.collection('diary').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
      console.log(change.doc.data());
      if(change.type == 'added'){
          renderDiary(change.doc);
      } else if (change.type == 'removed'){
          let container = main.querySelector('[data-id=' + change.doc.id + ']');
          main.removeChild(container);
      } //else if (change.type == 'modified') 
  });
});


/// render diary entries from firebase database
function renderDiary(doc) {

  let container = document.createElement('div')
  container.setAttribute('class', 'container')
  container.setAttribute('data-id', doc.id)

  let title = document.createElement('h2');
  title.textContent = doc.data().title;

  let date = document.createElement('span');
  date.setAttribute('class', 'date')
  date.textContent = doc.data().date;
       
  let comments = document.createElement('div');
  comments.setAttribute('class', 'comments')
  comments.textContent = doc.data().comments;

  let furtherHeading = document.createElement('h2');
  furtherHeading.textContent = 'Further Reading'
  let furtherRead = document.createElement('div');
  furtherRead.setAttribute('class', 'furtherRead')
  furtherRead.textContent = doc.data().further;

main.appendChild(container)
container.appendChild(title)
title.appendChild(date)
container.appendChild(comments)
container.appendChild(furtherHeading)  
container.appendChild(furtherRead)

///// delete button & append
let deleteDiv = document.createElement('button')
deleteDiv.setAttribute('class', 'delete')
deleteDiv.textContent = "Delete"
container.appendChild(deleteDiv)

// delete event listener remove from database
deleteDiv.addEventListener('click', deleted);
  function deleted (e) {
    let id = e.target.parentElement.getAttribute('data-id');
    let ok = confirm("Do you want to delete this entry from the database?");
    if (ok === true) {
      database.collection('diary').doc(id).delete();
    } 
 
  }
}

// select add new entry button and add eventlistener
let createForm = document.getElementById('createForm');
    createForm.addEventListener('click', newEntry);

//to stop user creating multiple forms
 createForm.addEventListener('click', hide)
  function hide () {
    createForm.disabled = true
    createForm.style.visibility = "hidden"
    console.log('Event: hide button')
}

// FORM SECTION ////////////////////////////////////////////////////////
 function newEntry (){
    console.log('Event: Run function to create form')

// Create a break line element 
const br = document.createElement("br");       
//Create a form dynamically 
let form = document.createElement("form"); 
console.log('Form created using JS only')
form.setAttribute('id', 'form')
// cancel cross
let x = document.createElement('p')
x.setAttribute('class', 'cancel')
x.textContent = "X"
//create a date entry
let date = document.createElement("input")
date.setAttribute("type","date")
//create input for title
let title = document.createElement("input"); 
title.setAttribute("type", "text"); 
title.setAttribute("name", "Title"); 
title.setAttribute("placeholder", "Title"); 
// text area for comments
let comments = document.createElement('textarea');
comments.setAttribute('name', 'comments');
comments.setAttribute('placeholder', 'What did you learn today? What went well/ what didnt go well')
comments.cols ="30";
comments.rows = "10";
let labelComments = document.createElement('label');
labelComments.textContent = 'Reflection';
//create further reading section
let toRead= document.createElement('textarea');
toRead.setAttribute('placeholder', 'Add further learning resources here')
toRead.cols ="30";
toRead.rows = "5";
let labelRead = document.createElement('label');
labelRead.textContent = 'Further Reading';
 // create a submit button 
const formbutton = document.createElement("input"); 
formbutton.setAttribute('id', 'formbutton')
formbutton.setAttribute("type", "button"); 
formbutton.setAttribute("value", "Submit"); 
              
            //append cancel
            form.appendChild(x)
            //append date
            form.appendChild(date)
            //append title
            form.appendChild(br.cloneNode()); 
            form.appendChild(title)
            //append comments
            form.appendChild(br.cloneNode()); 
            form.appendChild(labelComments);
            form.appendChild(br.cloneNode()); 
            form.appendChild(comments);
            // append further reading
            form.appendChild(br.cloneNode()); 
            form.appendChild(labelRead);
            form.appendChild(br.cloneNode()); 
            form.appendChild(toRead);
            // Append the submit button to the form 
            form.appendChild(br.cloneNode()); 
            form.appendChild(formbutton);  
            // append form to main section 
            main.appendChild(form); 
 
/// 'X' close form & show create entry button
x.addEventListener('click', closeForm);
x.addEventListener('click',reappear)

//form button event listeners
// save data to database from front end input
formbutton.addEventListener('click', addToDatabase)
function addToDatabase () {
  database.collection('diary').add({
    date: date.value,
    title: title.value,
    comments: comments.value,
    further: toRead.value
  })
}
  //closes form when click button submit
formbutton.addEventListener('click', closeForm);
function closeForm () {
    main.removeChild(form)
    console.log('Event: Remove form')
 }

// to allow user to create a new form when they have submitted the previous form     
formbutton.addEventListener('click', reappear)
function reappear () {
    createForm.disabled = false
    createForm.style.visibility = "visible"
    console.log('Show create entry button')
}

// display diary entries 
formbutton.addEventListener('click', renderDiary)

 }
 
 
