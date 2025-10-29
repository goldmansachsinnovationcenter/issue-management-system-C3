class Comment {
  constructor(id, name, text, timestamp, userId = null) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.timestamp = timestamp;
    this.userId = userId;
  }
}

module.exports = Comment;
