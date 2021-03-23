import inquirer from "inquirer";
import { TaskCollection } from "./models/TaskCollection";
import { tasks } from './Data'
import { JsonTaskCollection } from "./models/JsonTaskCollection";

const collection = new JsonTaskCollection('Your', tasks)

let hiddenShow:boolean = true

function displayTaskList(): void {
  console.log(`${collection.username}'s Tasks (${collection.getTaskCounts().incomplete}) task to do`)
  collection.getTaskItems(hiddenShow).forEach(task => task.printDetails());
}

enum Commands {
  Add = 'Add new task',
  Complete = 'Complete task',
  Toggle = 'Show/Hide completed',
  Purge = 'Remove completed tasks',
  Quit = 'Quit'
}

async function promptAdd(): Promise<void>{
  console.clear();
  const answers = await inquirer.prompt({
    type: 'input',
    name: 'add',
    message: 'Enter task:'
  });
  if(answers['add'] !== ''){
    collection.addTask(answers['add']);
  }
  promptUser()
}

async function promptCompleted(): Promise<void> {
  console.clear();
  const answers = await inquirer.prompt({
    type: 'checkbox',
    name: 'complete',
    message: 'Mark the completed tasks',
    choices: collection.getTaskItems(hiddenShow).map(item => ({
      name: item.task,
      value: item.id,
      checked: item.complete
    }))
  });
  
  let completedTasks = answers['complete'] as number[];
  collection
    .getTaskItems(true)
    .forEach(item => collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));

    promptUser();
}

async function promptUser() {
  console.clear();
  displayTaskList();

  const answers = await inquirer.prompt({
    type: 'list',
    name: 'command',
    message: 'Choose an option',
    choices: Object.values(Commands)
  });   
  switch(answers["command"]){
    case Commands.Add: 
        promptAdd();
        break;
    case Commands.Toggle:
      hiddenShow = !hiddenShow;
      promptUser();
      break;
    case Commands.Complete:
      if(collection.getTaskCounts().incomplete > 0){
        promptCompleted();
      } else {
        promptUser();
      }
      break;
    case Commands.Purge:
      collection.removeComplete();
      promptUser();
      break;
  } 
}

promptUser();