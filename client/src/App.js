import Auth from "./components/Auth";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useEffect,useState} from "react";
import { useCookies } from "react-cookie";
// import Modal from "./components/Modal";

const App=()=> {

  const[cookies,setCookie,removeCookie]=useCookies(null)
  const authToken=cookies.AuthToken
  const userEmail=cookies.Email
  
  const[tasks,setTask]=useState(null);

  
const getData=async()=>{
 

  try {

    const response = await fetch(`${process.env.REACT_APP_URL}/todos/${userEmail}`)
    const json =await response.json()
    // console.log(json)
    setTask(json)

  } catch (err) {
    
    console.error(err)

  }
}

useEffect(()=>{
  if(authToken){
    getData()
  }
},[])

// console.log(tasks)


//sort by date
const sortedTask=tasks?.sort((a,b)=> new Date (a.date) - new Date(b.date))

  return (
    <div className="app">
     {!authToken && <Auth/> }
     {authToken &&
     <>
     <ListHeader  listName={'🏖️Holiday tick list '}  getData={getData}/>
     <p className="user-email">Welcome Coding {userEmail}</p>
     {sortedTask?.map((task)=> <ListItem key={task.id} task={task}  getData={getData}/>)}

      </>}

        <p className="copyright">© Creative Coding LLC</p>
    </div>
  );
}

export default App;
