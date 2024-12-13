export default function Meme(id, imageUrl,title) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.title = title;

    this.toJSON = () => {
        return { ...this };
    };

}
