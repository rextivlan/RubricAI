import { useState } from 'react'; // Importing Modules
// Creating a function to track the changes in DropDown List
function DropdownList() { 
//Using useState to set the defualt value of DropDown Menu and declare the values
 const [selectedValue, setSelectedValue] = useState('Select Option'); 
const handleChange = (event) => {
 setSelectedValue(event.target.value);
 };
return (
 <select value={selectedValue} onChange={handleChange}>
 <option value="Essay">Essay</option>
 <option value="Presentation">Presentation</option>
 <option value="Test">Test</option>
 <option value="Coding">Coding</option>

 </select>
 );
}
export default DropdownList;