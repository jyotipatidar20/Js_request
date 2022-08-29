const axios=require("axios");
const fs=require("fs");
const rs=require("readline-sync");
const getData=()=>{
  axios.get("https://api.merakilearn.org/courses")
    .then(response=>{
        var User_Data=response.data;
        fs.writeFileSync("courses.json",JSON.stringify(User_Data,null,4));
        // console.log(User_Data)
        let p=1;
        for(let i of User_Data){
          console.log(`${p} ${i["name"]} ${i["id"]}`)
          p++
        }
        const user=rs.question("Enter which programme do you want:");
        console.log(`${User_Data[user-1]["name"]} : ${User_Data[user-1]["id"]}`);
        const file_Content=User_Data[user-1]["name"]+"_"+User_Data[user-1]["id"];
        const link="https://api.merakilearn.org/courses/"+User_Data[user-1]["id"]+"/exercises";
        axios.get(link)
            .then(exercise=>{
                const exercise_Data=exercise.data;
                fs.writeFileSync(file_Content,JSON.stringify( exercise_Data,null,4));
                let topic_Count=1;
                for(let i of exercise_Data["course"]["exercises"]){
                  console.log(`${topic_Count} ${i["name"]}`)
                  topic_Count++
                }
                const topic=rs.question("Enter topic number whichever you want:");
                let  topic_Index=topic-1;
                for (let i of exercise_Data["course"]["exercises"][topic_Index]["content"]){
                  console.log(i["value"])
                }
                while(topic_Index<=(exercise_Data["course"]["exercises"]).length){
                  const next_Perivious=rs.question("Whts do you want n/p:")
                  if(next_Perivious=="p"){
                    topic_Index=topic_Index-1;
                    if(1<=topic_Index || topic_Index==0){
                      console.log(exercise_Data["course"]["exercises"][topic_Index]["name"])
                      for(let i of exercise_Data["course"]["exercises"][topic_Index]["content"]){
                      console.log(i["value"])
                      }
                    }else{
                      console.log("Finished !")
                      break
                    }
                  }
                  else if(next_Perivious=="n"){
                    topic_Index++;
                    if(topic_Index<(exercise_Data["course"]["exercises"]).length){
                      console.log(exercise_Data["course"]["exercises"][topic_Index]["name"])
                      for (let i of exercise_Data["course"]["exercises"][topic_Index]["content"]){
                        console.log(i["value"])
                      }
                    }else{
                      console.log("Topic Completed!")
                      break
                    }
                  }else{
                    console.log("Wrong Input!")
                    break
                  }
                }
              })
    })
}
const requestData=getData();