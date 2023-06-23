/*var day=new Date();
var entrance=day.getHours()+" AM"+day.getMinutes()+" "+day.getSeconds();*/

//Entry Class: Represent each entry in the parking lot
class Entry{
    constructor(owner,car,licensePlate,entryDate,exitDate){
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
}
//UI Class: Handle User Interface Tasks
class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.car}</td>
                            <td>${entry.licensePlate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.exitDate}</td>
                            <td><button class="btn btn- delete text-danger">X</button></td>
                        `;
        tableBody.appendChild(row);
    }
    static clearInput(){
        //Selects all the inputs
        const inputs = document.querySelectorAll('.form-control');
        //Clear the content of each input
        inputs.forEach((input)=>input.value="");
    }
    static deleteEntry(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
   static validateInputs(){
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        var licensePlateRegex = /^(?:[A-Z]{1}\d{2}\d{2})|(?:\d{2}[A-Z]{2}\d{2})|(?:\d{2}\d{2})$/;
        if(owner === '' || car === '' || licensePlate === '' || entryDate === '' || exitDate === ''){
            UI.showAlert('All fields must me filled!','danger');
            return false;
        }
        if(exitDate < entryDate){
            UI.showAlert('Exit Date cannot be lower than Entry Date','danger');
            return false;
        }
        if(!licensePlateRegex.test(licensePlate)){
            UI.showAlert('License Plate must be like 32-56-7, A-11-1, 12-34-5','danger');
            return false;
        }
        return true;
    }
     /*
    static validateInputs() {
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        const licensePlateRegex = /^(?:[A-Z]\d{5}|[0-9]{6})$/;
      
        // Check if all fields are filled
        if (owner === '' || car === '' || licensePlate === '' || entryDate === '' || exitDate === '') {
          UI.showAlert('All fields must be filled!', 'danger');
          return false;
        }
      
        // Check if exit date is before entry date
        if (exitDate < entryDate) {
          UI.showAlert('Exit Date cannot be lower than Entry Date', 'danger');
          return false;
        }
      
        // Check if license plate number matches the specified format
        if (!licensePlateRegex.test(licensePlate)) {
          UI.showAlert('License Plate must be like 'danger');
          return false;
        }
      
        // Return true if all fields are valid
        return true;
      }*/

      /*
static validateInputs() {
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        const licensePlateRegex = /^(?:[A-Z]\d{5}|[0-9]{6})$/;
      
        // Check if all fields are filled
        if (owner === ''  car === ''  licensePlate === ''  entryDate === ''  exitDate === '') {
          UI.showAlert('All fields must be filled!', 'danger');
          return false;
        }
      
        // Check if exit date is before entry date
        if (exitDate < entryDate) {
          UI.showAlert('Exit Date cannot be lower than Entry Date', 'danger');
          return false;
        }
      
        // Check if license plate number matches the specified format
        if (!licensePlateRegex.test(licensePlate)) {
          UI.showAlert('License Plate must be like 'danger');
          return false;
        }
      
        // Return true if all fields are valid
        return true;
      }
      */
      
}
//Store Class: Handle Local Storage
class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licensePlate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
//Event Display
    document.addEventListener('DOMContentLoaded',UI.displayEntries);
//Event Add
    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        
        //Declare Variables
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        if(!UI.validateInputs()){
            return;
        }
        //Instatiate Entry
        const entry = new Entry(owner, car, licensePlate, entryDate, exitDate);
        //Add the entry do de UI table
        UI.addEntryToTable(entry);
        Store.addEntries(entry);
        //Delete content of input's
        UI.clearInput();

        UI.showAlert('Car successfully added to the parking lot','success');

    });
//Event Remove
    document.querySelector('#tableBody').addEventListener('click',(e)=>{
        //Call to UI function that removes entry from the table
        UI.deleteEntry(e.target);
        //Get license plate to use as unique element of an entry
        var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        //Call to Store function to remove entry from the local storage
        Store.removeEntries(licensePlate);
        //Show alert that entry was removed
        UI.showAlert('Car successfully removed from the parking lot list','success');
    })

//Event Search
    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        //Get value of the input search
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
        //Get all lines of table body
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
        //for loop #1 (used to pass all the lines)
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
            //Get all collumns of each line
            const lineValues = tableLine[i].querySelectorAll('td');
            //for loop #2 (used to pass all the collumns)
            for(let j = 0; j < lineValues.length - 1; j++){
                //Check if any collumn of the line starts with the input search string
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                //If any collumn contains the search value the display block
                tableLine[i].style.display = '';
            }else{
                //Else display none 
                tableLine[i].style.display = 'none';
            }
        }
        
    /*function calculateEntryAndExitTime() {
      // Create a JavaScript object to store the entry and exit time for each car.
      const car = {
        entryTime: new Date(),
        exitTime: null
      };

      // Get the current time
      const currentTime = new Date();

      // Set the entry time for the car
      car.entryTime = currentTime;

      // When the car exits the parking lot, get the current time again
      currentTime = new Date();

      // Set the exit time for the car
      car.exitTime = currentTime;

      // Calculate the difference between the entry time and the exit time
      const timeInParkingLot = car.exitTime - car.entryTime;

      // Store the difference in the JavaScript object
      car.timeInParkingLot = timeInParkingLot;

      // Display the entry and exit time for the car
      document.getElementById("entryTime").innerHTML = car.entryTime;
      document.getElementById("exitTime").innerHTML = car.exitTime;
      document.getElementById("timeInParkingLot").innerHTML = car.timeInParkingLot;
    }
    */
  
    });