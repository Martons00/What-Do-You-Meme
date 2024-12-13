export default function Caption(id, text) {
    this.id = id;
    this.text = text;

    this.toJSON = () => {
        return { ...this };
    };

}
