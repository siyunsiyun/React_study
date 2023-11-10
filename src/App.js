import logo from './logo.svg';
import './App.css';
import {useState} from "react";

function Header(props){
  console.log('props', props,props.title)
  return <header>
      <h1><a href="/" onClick={function(event){
        event.preventDefault();
        props.onChangeMode();
        
      }}>{props.title}</a></h1> 
    </header> 
}{/* 홈으로 이동하는 헤더 영역 */}

function Nav(props){
  const lis =[]

  for(let i=0; i<props.topics.length;i++){
    let t=props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}href={'/read/'+t.id}>{t.title}</a></li>)
  }

  return <nav>
      <ol>
        {lis}
      </ol>
    </nav>
}{/* 구체적인 글을 보는 페이지로 이동하는 영역 */}

function Article(props){
  return <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>

}{/* 본문을 표시하는 영역 */}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={(event)=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title,body);
      }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
 }{/*새로운 상세보기를 생성하기 위한 폼을 표시하는 영역*/}

 function Update(props){
  const [title,setTitle] =useState(props.title);
  const [body,setBody] =useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={(event)=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title,body);
      }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={(event)=>{
        setTitle(event.target.value)
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={(event)=>{
        setBody(event.target.value)
      }}></textarea></p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>
 }{/*기존의 상세보기를 변경하기 위한 폼을 표시하는 영역*/}

function App() {
  const [mode,setMode]= useState("WELCOME");
  const [id,setId]=useState(null); //id= 누른 링크의 아이디
  const [topics,setTopics] = useState([
    {id:1, title:"html", body:"html is ..."},
    {id:2, title:"css", body:"css is ..."},
    {id:3, title:"js", body:"js is ..."},
  ]);
  const [nextId,setNextId] = useState(4); //전체 topic의 갯수+1
  let content =null;
  let contextControll = null;
  if(mode==='WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode ==="READ"){
    let title, body =null;
    for(let i=0;i<topics.length;i++){
      if(id===topics[i].id){
        content =  <Article title={topics[i].title} body={topics[i].body}></Article>
        break;
      }
    }
    contextControll = <>
    <li><a href={"/update/"+id} onClick={(event)=>{
      event.preventDefault();
      setMode("Update");
    }}>Update</a></li>
    <li><input type="button" value="Delete" onClick={()=>{
      // event.preventDefault(); 버튼은 할 필요x
      const newTopics=[];
      for(let i=0;i<topics.length;i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode("WELCOME");
    }}/></li>
  </>
  }else if(mode==="CREATE"){
    content = <Create onCreate={(title,body)=>{
      const newTopic = {id:nextId ,title:title , body:body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setId(nextId);
      setMode("READ");
      setNextId(nextId+1);
    }}></Create>
  }else if(mode ==="Update"){
    let title, body =null;
    for(let i=0;i<topics.length;i++){
      if(id===topics[i].id){
        content =  <Update title={topics[i].title} body={topics[i].body} onUpdate={(title,body)=>{
          const newTopics = [...topics];
          newTopics[id-1]={id:id , title:title , body:body};
          setTopics(newTopics);
          setMode("READ");
        }}></Update>
        break;
      }
    }
  }


  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        alert("Header");
        setMode("WELCOME");
      }}></Header>
      <Nav topics={topics} onChangeMode={(id)=>{
        alert(id);
        setId(id);
        setMode("READ");
      }}></Nav>
      {content}
      <ul>
      <li><a href="/create" onClick={(event)=>{
        event.preventDefault();
        setMode("CREATE");
      }}>Create</a></li>
      {contextControll}
      </ul>
    </div>
  );
}

export default App;
