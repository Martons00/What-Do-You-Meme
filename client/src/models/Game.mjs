export default function Game(id, username, total_score,start_time,end_time) {
    this.id = id;
    this.username = username;
    this.total_score = total_score;
    this.start_time = start_time;
    this.end_time = end_time;

    this.toJSON = () => {
      return { ...this };
    };

  
}
