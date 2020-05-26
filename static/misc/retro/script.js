const CLIENT_ID =
  "92514091267-5oqk1jn6hfh3pqic713v40pvg45qd724.apps.googleusercontent.com";
const API_KEY = "AIzaSyA8KOMASphErwbeb5jj-xi6i06o9veBcKI";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/calendar";

const calendarId = "psliv3me9idh57hk3u7m0694kk@group.calendar.google.com";
const dailyTitle = "Review yesterday";
const sprintTitle = "Review sprint";
const quarterTitle = "Review quarter";

const titleRanking = {
  [dailyTitle]: 0,
  [sprintTitle]: 1,
  [quarterTitle]: 2
};
const titleName = {
  [dailyTitle]: date => dateFns.format(date, "dddd Do"),
  [sprintTitle]: date =>
    `Sprint of ${dateFns.format(
      dateFns.subDays(date, 11),
      "dddd Do [of] MMMM"
    )} – ${dateFns.format(date, "Do [of] MMMM")}`,
  [quarterTitle]: date => `Q${dateFns.format(date, "Q")}`
};
const currentName = {
  0: "Today",
  1: "Current sprint",
  2: `Q${dateFns.format(new Date(), "Q")}`
};
const maxRank = Object.keys(titleRanking).length;

const prompt = `- How am I feeling right now?
- How am I feeling about my leadership?
- What deserves my highest-quality attention…
  + in my leadership?
  + in my life?
  + in the world?
- What is the most outrageous (or fun or novel) idea I’ve heard in the last 24 hours? What do I love about it?
- What is the most exciting initiative I’ve heard about this week that is happening outside of my industry or in another part of the world?
- What contributed most to my happiness this week (or to the happiness of my people)? How can I have more happiness in my life?`;

const authorizeButton = document.getElementById("authorize_button");
const signoutButton = document.getElementById("signout_button");

function when(event) {
  return event.start.dateTime || event.start.date;
}

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  });
  const authInstance = gapi.auth2.getAuthInstance();

  authorizeButton.onclick = handleAuthClick;
  signoutButton.onclick = handleSignoutClick;

  authInstance.isSignedIn.listen(updateSigninStatus);
  await updateSigninStatus(authInstance.isSignedIn.get());
}

async function getEventList() {
  const response = await gapi.client.calendar.events.list({
    calendarId,
    timeMax: dateFns.endOfDay(new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 99999
  });

  return response.result.items;
}

class EventDescriptionKeeper {
  constructor(event) {
    this.event = event;
    this.rootNode = document.createElement("div");
    this.renderStaticText();
  }

  getNode = () => this.rootNode;

  getEventDescription = () => (this.event.description || "").trim();

  renderStaticText = () => {
    const textNode = document.createElement("p");
    textNode.className = "event-description";
    const eventDescription = this.getEventDescription();
    if (eventDescription) {
      textNode.innerText = eventDescription;
    } else {
      textNode.classList.add("empty");
      textNode.innerText = "No review!";
    }

    textNode.onclick = this.renderEditableText;

    emptyNode(this.rootNode);
    this.rootNode.appendChild(textNode);
  };

  renderEditableText = () => {
    const textNode = document.createElement("textarea");
    textNode.className = "editable-event-description";
    textNode.innerHTML = prompt + "\n\n" + this.getEventDescription();

    emptyNode(this.rootNode);
    this.rootNode.appendChild(textNode);
    textNode.focus();

    // do in a separate tick to avoid binding to the click event that caused the
    // edit render in the first place
    setTimeout(() => document.addEventListener("click", this.submitEdit));
  };

  submitEdit = async e => {
    if (e.target && e.target.parentNode === this.rootNode) {
      // don't count as an edit if clicking within the node
      return;
    }

    document.removeEventListener("click", this.submitEdit);

    const textNode = this.rootNode.querySelector("textarea");
    const newDescription = textNode.value.replace(prompt, "").trim();
    if (newDescription !== this.getEventDescription()) {
      textNode.disabled = true;
      const submittedDescription = await this.submitNewCalendarDescription(
        newDescription
      );
      this.event.description = submittedDescription;
    }

    this.renderStaticText();
  };

  submitNewCalendarDescription = async description => {
    const response = await gapi.client.calendar.events.patch({
      calendarId,
      eventId: this.event.id,
      description
    });
    return response.result.description;
  };
}

class EventKeeper {
  constructor(eventList) {
    this.reviewTasks = eventList
      .filter(this.isReviewTask)
      .map(this.cookEvent)
      .sort(this.sortEvents);

    this.nonReviewTasks = eventList
      .filter(event => !this.isReviewTask(event))
      .map(this.cookEvent)
      .sort(this.sortEvents);
  }

  getReviewTasks = () => this.reviewTasks;

  getLastEventOfRank = rank => {
    const tasksOfRank = this.reviewTasks.filter(
      event => titleRanking[event.summary] === rank
    );
    return tasksOfRank[0];
  };

  getNonReviewTasksOnDay = date => {
    const startOfDay = dateFns.startOfDay(date);
    const endOfDay = dateFns.subMinutes(dateFns.endOfDay(date), 1);

    return this.nonReviewTasks.filter(event =>
      dateFns.isWithinRange(when(event), startOfDay, endOfDay)
    );
  };

  isReviewTask = event =>
    [dailyTitle, sprintTitle, quarterTitle].includes(event.summary);

  cookEvent = event => {
    const ranking = titleRanking[event.summary];

    const curDate = when(event);
    // skip the weekend!
    const dayBeforeDaysAgo = dateFns.isMonday(curDate) ? 3 : 1;

    const dayTarget = dateFns.subDays(
      curDate,
      ranking === 0 && this.isReviewTask(event) ? dayBeforeDaysAgo : 0
    );
    const newDate = dateFns.startOfDay(dayTarget);

    return {
      ...event,
      start: {
        ...event.start,
        dateTime: newDate,
        date: newDate
      }
    };
  };

  sortEvents = (evA, evB) => {
    const dateComp = dateFns.compareDesc(when(evA), when(evB));
    if (dateComp !== 0) return dateComp;

    const evARanking = titleRanking[evA.summary];
    const evBRanking = titleRanking[evB.summary];

    return evARanking > evBRanking ? -1 : 1;
  };
}

class EventRenderer {
  constructor(eventKeeper, targetNode) {
    this.eventKeeper = eventKeeper;
    this.targetNode = targetNode;
  }

  createEventNode = (ranking, event) => {
    const eventNode = document.createElement("div");
    eventNode.className = `ranking${ranking}`;

    const headerRanking = maxRank + 1 - ranking;
    const eventTitle = document.createElement("h" + headerRanking);
    eventTitle.innerText = event
      ? titleName[event.summary](when(event))
      : currentName[ranking];

    eventNode.appendChild(eventTitle);

    if (event) {
      const eventDescriptionKeeper = new EventDescriptionKeeper(event);
      eventNode.appendChild(eventDescriptionKeeper.getNode());
    }

    return eventNode;
  };

  renderEvent = event => {
    const ranking = titleRanking[event.summary];
    const eventNode = this.createEventNode(ranking, event);

    if (ranking === 0) {
      const nonReviewTasks = this.eventKeeper.getNonReviewTasksOnDay(
        when(event)
      );
      const eventTaskList = document.createElement("ul");
      eventTaskList.className = "non-review-tasks";
      nonReviewTasks.forEach(event => {
        const eventTaskItem = document.createElement("li");
        eventTaskItem.innerText = event.summary;
        eventTaskList.appendChild(eventTaskItem);
      });

      eventNode.appendChild(eventTaskList);
    }

    this.targetNode.appendChild(eventNode);
  };

  render = () => {
    const lastEventOfRank2 = this.eventKeeper.getLastEventOfRank(2);
    if (!lastEventOfRank2 || !dateFns.isToday(when(lastEventOfRank2)))
      this.targetNode.appendChild(this.createEventNode(2));

    const lastEventOfRank1 = this.eventKeeper.getLastEventOfRank(1);
    if (!lastEventOfRank1 || !dateFns.isToday(when(lastEventOfRank1)))
      this.targetNode.appendChild(this.createEventNode(1));

    const reviewTasks = this.eventKeeper.getReviewTasks();
    reviewTasks.forEach(this.renderEvent);
  };
}

async function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";

    const targetNode = document.getElementById("content");

    const eventList = await getEventList();
    const eventKeeper = new EventKeeper(eventList);
    const renderer = new EventRenderer(eventKeeper, targetNode);

    renderer.render();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
