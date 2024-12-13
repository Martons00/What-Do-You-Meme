export default function Round(id, gameId, memeId,username, selectedCaptionId, isCorrect, score) {
  this.id = id;
  this.gameId = gameId;
  this.memeId = memeId;
  this.username = username;
  this.selectedCaptionId = selectedCaptionId;
  this.isCorrect = isCorrect;
  this.score = score;

  this.toJSON = () => {
    return { ...this };
  };

}
