import React, { useState } from 'react';
import './App.css';
import Swal from "sweetalert2";

const Card = (props) => {

  let data = props.data, color = data.check ? "green" : "grey", prio;
  "high" === data.prio ? prio = "is-danger" : "medium" === data.prio ? prio = "is-warning" : prio = "is-primary";

  return (<>
    <header className="card-header">
      <p className="card-header-title">
        {data.title}
      </p>
      <p className="card-header-icon" aria-label="check">
        <span className="icon">
          <i className="fas fa-check-double" style={{ "color": color }} aria-hidden="true"></i>
        </span>
      </p>
    </header>
    <div className="card-content">
      <div className="content">
        <p className={`tag ${prio} is-size-6`}>
          Priority : {data.prio}
        </p><br />
        <b>DeadLine : {data.dead}</b>
      </div>
    </div>
  </>)
}

function App() {
  //initial data
  const [data, setdata] = useState(localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : []),
    //event handler 
    clickhandler = async () => {
      //extract value from sweetalert
      let { value: title } = await Swal.fire({
        title: "Title", html: "Title of the Task", icon: "question", input: "text", showCancelButton: true,
        inputValidator: (val) => { if (!val) return "Type Something" }
      }),
        { value: prio } = await Swal.fire({
          title: "Priority", input: "radio", icon: "question", inputOptions: { "high": "high", "medium": "medium", "primary": "primary" }
          , inputValidator: (val) => { if (!val) return "Choose someone" }, showCancelButton: true
        }),
        { value: dead } = await Swal.fire({
          title: "Deadline", html: "of the Task", showCancelButton: true,
          icon: "question", input: "text", inputValidator: (val) => { if (!val) return "Required Field" }
        });
      //created at *t*
      if (title && prio && dead) {
        let t = new Date().toISOString(),
          i, arr = [{ title: title, prio: prio, check: false, dead: dead, id: t }];
        //copy intial data
        for (i = 0; i < data.length; i++)arr[i + 1] = data[i];
        //show the updated content
        setdata(arr);
        //save to localstorage
        localStorage.setItem("data", JSON.stringify(arr));
      }
    },
    share = async () => {
      await window.navigator.share({
        title: "TODO App",
        text: "Record all yours Task effectively with CRUD features",
        url: "https://hello.world.com/"
      });
    },
    deletehandler = async (title, id) => {
      let { isConfirmed: prompt } = await Swal.fire({
        title: "Warning", icon: "warning", showCancelButton: true,
        html: `Are you want to <br/><b>Delete</b> <br/>the reminder titled <br/><b>${title}</b>`
      });
      if (prompt) {
        let full = JSON.parse(localStorage.getItem("data")), arr = [], i;
        for (i = 0; i < full.length; i++) {
          if (id !== full[i].id) { arr.push(full[i]); }
        }
        if (arr.length === 0) { setdata([]); localStorage.removeItem("data"); }
        else { setdata(arr); localStorage.setItem("data", JSON.stringify(arr)); }
      }
    },
    donehandler = (id) => {
      let whole = JSON.parse(localStorage.getItem("data")), arr = [], i;
      for (i = 0; i < whole.length; i++) {
        if (whole[i].id === id) {
          let obj = { title: whole[i].title, prio: whole[i].prio, check: true, dead: whole[i].dead, id: whole[i].t };
          arr[i] = obj;
        }
        else arr[i] = whole[i];
      }
      localStorage.setItem("data", JSON.stringify(arr));
      setdata(arr);
    },
    edithandler = async (title, id) => {
      let { isConfirmed: prompt } = await Swal.fire({
        title: "Warning", icon: "warning", showCancelButton: true,
        html: `Are you want to <br/><b>Edit</b><br/> the task<br/> titled <br/><b>${title}</b>`
      });
      if (prompt) {
        let full = JSON.parse(localStorage.getItem("data")), arr = [], i,
          { value: title } = await Swal.fire({
            title: 'Updated Title', html: 'for the Task ', icon: "question",
            input: "text", inputValidator: (val) => { if (!val) return 'Write something' }
          }),
          { value: prio } = await Swal.fire({
            title: 'Updated Priority', html: 'of the Task', icon: "question",
            input: "radio", inputOptions: { "high": "high", "medium": "medium", "primary": "primary" },
            inputValidator: (val) => { if (!val) return "choose someone" }
          }),
          { value: dead } = await Swal.fire({
            title: "Updated Deadline", html: "of the Task", icon: "question",
            input: "text", inputValidator: (val) => { if (!val) return "write the updated deadline of the task" }
          });
        for (i = 0; i < full.length; i++) {
          if (full[i].id === id) {
            let obj = { title: title, prio: prio, check: full[i].check, dead: dead, id: full[i].t }
            arr[i] = obj;
          } else { arr[i] = full[i]; }
        }
        localStorage.setItem("data", JSON.stringify(arr));
        setdata(arr);
      }
    };
  return (<>
    <div className="card app-name">
      <header className="card-header">
        <p className="card-header-title is-size-3">
          To-Do App
          <span className="parent">
            <i className="fas fa-share-alt" onClick={share}></i>
            <i className="fas fa-plus" onClick={clickhandler}></i>
          </span>
        </p>
      </header>
    </div>
    {
      data && (data.length === 0
        ? <div className="notification is-link m-6 is-size-3">Nothing to do ! </div>
        : data.map((data, index) => (
          <div key={index} className="card each">
            <div onClick={() => deletehandler(data.title, data.id)}>
              <Card data={data} />
            </div>
            <footer className="card-footer">
              <p onClick={() => donehandler(data.id)} className="card-footer-item">
                <i className="fas fa-check mr-1"></i> Done
              </p>
              <p onClick={() => edithandler(data.title, data.id)} className="card-footer-item">Edit</p>
            </footer>
          </div>)))
    }
  </>);
}
export default App;