export default function Game(id, userId, totalScore = 0) {
    this.id = id;
    this.userId = userId;
    this.totalScore = totalScore;

    this.toJSON = () => {
      return { ...this };
    };

  
}
