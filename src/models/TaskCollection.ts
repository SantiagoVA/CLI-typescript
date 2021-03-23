import { TaskItem } from "./TaskItem";

type TaskCounts = {
  total: number,
  incomplete: number
}

export class TaskCollection {
    nextId: number = 1;
    taskMap = new Map<number, TaskItem>();

    constructor(public username: string, public taskItems: TaskItem[] = []){
      taskItems.forEach(item => this.taskMap.set(item.id, item));
    }

    addTask(task: string): number{
      while(this.getTaskById(this.nextId)){
        this.nextId++;
      }
      this.taskMap.set(this.nextId, new TaskItem(this.nextId, task));
      return this.nextId;
    }

    getTaskItems(includeComplete: boolean): TaskItem[] {
      return [...this.taskMap.values()].filter(task => includeComplete || !task.complete);
    }

    getTaskById(id: number): TaskItem | undefined {
      return this.taskMap.get(id);
    }
  
    markComplete(id: number, complete: boolean): void {
      const taskItem = this.getTaskById(id);
      if (taskItem){
        taskItem.complete = complete;
      }
    }

    removeComplete(): void {
      this.taskMap.forEach(item => {
        if(item.complete){
          this.taskMap.delete(item.id);
        }
      })
    }

    getTaskCounts(): TaskCounts {
      return {
        total: this.taskMap.size,
        incomplete: this.getTaskItems(false).length
      }
    }
  }