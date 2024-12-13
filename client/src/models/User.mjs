export default function User(id, username) {
  this.id = id;
  this.username = username;

  this.toJSON = () => {
    return { ...this };
  };
}
