class Issue {
  constructor(id, subject, impactedApplication, reporterName, reportedTime, initialObservations, notificationEmails, priority, assignedTo, status = 'new') {
    this.id = id;
    this.subject = subject;
    this.impactedApplication = impactedApplication;
    this.reporterName = reporterName;
    this.reportedTime = reportedTime;
    this.initialObservations = initialObservations;
    this.notificationEmails = notificationEmails;
    this.priority = priority;
    this.assignedTo = assignedTo;
    this.status = status;
    this.comments = [];
  }

  addComment(comment) {
    this.comments.push(comment);
  }

  updateStatus(status) {
    if (['new', 'assigned', 'closed', 'rejected'].includes(status)) {
      this.status = status;
      return true;
    }
    return false;
  }
}

module.exports = Issue;
