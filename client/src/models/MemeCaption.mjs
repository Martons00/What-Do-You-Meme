// MemeCaption.mjs

export default function MemeCaption(memeId, captionId) {
    this.memeId = memeId;
    this.captionId = captionId;
  
    this.toJSON = () => {
      return { ...this };
    };
  }
  