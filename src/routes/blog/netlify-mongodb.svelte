<script>
  import BlogMeta from "../../components/blog-meta.svelte";
  import Code from "../../components/code.svelte";
</script>

<BlogMeta
  slug="netlify-mongodb"
  title="Jamming with MongoDB and Netlify"
  subtitle="Netlify can support a MongoDB database — a tale in having your cake and eating it too"
  headerImage="/blog/netlify-mongodb/handshake.jpg"
  headerAlt="two people shaking hands, photoshopped to have their heads replaced by the Netlify and MongoDB logos"
  keywords="netlify,mongodb,database,jam"
  published="2020-06-15"
  recommended="speeding-up-webpack"
>
  true
</BlogMeta>

<p>
  You enter the realm of Jamstack and approach the Netlify Council. They spot
  the MongoDB requirement in your app, and a long and painful silence stretches
  out.
</p>

<p>Will they allow this afront to Jamstack?</p>

<p>
  Fortunately, Netlify isn’t a one-trick pony, and it does allow integration
  with a database, like MongoDB.
</p>

<h2>FaunaDB Warning</h2>

<p>
  Quick PSA: if you’re creating a database from scratch, not moving across an
  existing database, then you should seriously consider using
  <a href="https://docs.fauna.com/fauna/current/integrations/netlify.html">
    FaunaDB
  </a>
  instead. Netlify doesn’t have first-party support for MongoDB, so what we have
  to do in this guide is less secure.
</p>

<p>
  Also — don’t take drugs, and stay in school. Now back to our regularly
  scheduled programming.
</p>

<h2>Getting Started with Netlify</h2>

<p>
  First things first, you’ll need to get a basic build set up on Netlify. I
  would recommend
  <a
    href="https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/"
  >
    following this guide
  </a>
  and coming back here once you have a site being built and deployed.
</p>

<h2>Netlify Functions</h2>

<p>
  We’ll be using
  <a href="https://docs.netlify.com/functions/overview/">Netlify Functions</a>
  to let our site connect to our database. These are Lambda functions that run dynamically
  on the server, but we’ll write alongside the rest of our code.
</p>

<p>
  First, let’s add a
  <code>functions</code>
  field to our
  <code>netlify.toml</code> (or
  <a href="https://docs.netlify.com/configure-builds/file-based-configuration/">
    create a
    <code>netlify.toml</code>
  </a>
  if you haven’t already).
</p>

<Code
  language="ini"
  code={`
[build]
  # Directory with the serverless Lambda functions
  functions = "lambda_functions"`}
/>

<p>
  Great! Now let’s create a Lambda function, to see what’s what. Create a new
  file called
  <code>what_is_the_time.js</code>
  in that folder:
</p>

<Code
  language="javascript"
  code={`
// ./lambda_functions/what_is_the_time.js

// This \`handler\` is what is called when your Lambda
// function is triggered. For more full specs on it see
// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
module.exports.handler = async (event, context) => {
  const unixTime = Math.floor(Date.now() / 1000);
  return {
    statusCode: 200,
    body: \`The Unix time is \${unixTime}\`,
  };
};`}
/>

<p>
  Now, if we deploy this, we should be able to call this function by making a
  <code>GET</code>
  request to
  <b>/.netlify/functions/what_is_the_time</b>
  — and see what the time is:
</p>

<img
  src="./blog/netlify-mongodb/what-is-the-time.png"
  alt="Our website showing us the current Unix time, from the server"
  width="800"
  class="framed"
/>

<p>Huzzah!</p>

<h2>Dependencies with Netlify Functions</h2>

<p>
  As much as it’s great to know what the time is, we eventually want to be able
  to access our MongoDB database. To do this, we want to access a
  <a href="https://www.npmjs.com/package/mongodb">MongoDB client</a>
  — so let’s download that.
</p>

<Code language="bash" code={`npm install mongodb`} />

<p>
  We can run this just from our project root, Netlify will make sure that our
  Lambda functions get access to it properly. Note that in this guide I’m using
  <code>mongodb@3</code>.
</p>

<h2>Access Data from our Database</h2>

<p>
  As I mentioned earlier in this guide, I assume you’ve already got a MongoDB
  database ready to go. If not, I
  <i>highly</i>
  recommend that you instead look at
  <a href="https://docs.fauna.com/fauna/current/integrations/netlify.html">
    using FaunaDB
  </a>
  on your Netlify site. FaunaDB has dedicated Netlify support, which MongoDB sadly
  does not have — meaning we have to do some less-than-perfect things to get things
  working with MongoDB.
</p>

<p>
  So let’s create a new Lambda function to access our database. I’m going to
  call mine
  <code>pokemon.js</code>
  since my database holds a collection of my favourite Pokémon. It’s a crucial database
  and one that I desperately need access to through the web.
</p>

<Code
  language="javascript"
  code={`
// ./lambda_functions/pokemon.js

const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'REPLACE_ME_WITH_YOUR_DB_NAME';

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const queryDatabase = async (db) => {
  const pokemon = await db.collection("pokemon").find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pokemon),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);
  return queryDatabase(db);
};
`}
/>

<p>
  Note that we reference a
  <code>process.env.MONGODB_URI</code>
  at the start. We can’t inline this URI in the code since it will include our DB
  credentials.
</p>

<p>
  So first of all, let’s grab our MongoDB URI. You can
  <a href="https://docs.atlas.mongodb.com/driver-connection/">follow this</a>
  if you’re unsure what that is, but it should look something like this:
</p>

<Code
  language="bash"
  code={`mongodb+srv://ashketchum:supersecurepassword123@cluster0-2cka2.mongodb.net/test?retryWrites=true&w=majority`}
/>

<p>
  And we’re going to put that into
  <a
    href="https://docs.netlify.com/configure-builds/environment-variables/#declare-variables"
  >
    a Netlify build variable
  </a>
  (which our Lambda function can access), and call it
  <code>MONGODB_URI</code>
  like so:
</p>

<img
  src="./blog/netlify-mongodb/add-netlify-build-var.png"
  alt="Adding MongoDB URI environment variable"
  width="800"
  class="framed"
/>

<h2>Whitelisting (Here Be Dragons)</h2>

<p>
  So at this point, you may notice that making a
  <code>GET</code>
  request to
  <b>/.netlify/functions/pokemon</b>
  still doesn’t work. Unfortunately, MongoDB comes by default with whitelist protection,
  meaning that it only allows specific IP ranges to access your database.
</p>

<p>
  And unfortunately, our Lambda functions come from a variable IP range, we
  can’t safely say what the IP will be, so we can’t whitelist anything.
</p>

<p>
  Usually, we would try and give our Lambda function a fixed IP, or create a
  Network Peering Connection — sadly Netlify doesn’t (at the time of writing
  this) support either of these things.
</p>

<p>
  So instead,
  <a
    href="https://community.netlify.com/t/fetching-mongodb-data-with-lambda-functions/11225/5"
  >
    what Netlify recommend
  </a>
  is that we open up our database to the entire internet.
</p>

<p>
  What this means is that
  <i>anyone</i>
  —
  <i>anywhere</i>
  can access your database, if they know your password. So before doing this,
  <i>please</i>
  make sure that your
  <b>password is secure,</b>
  and that he database user has as
  <b>few permissions as possible</b>
  — I recommend
  <a href="https://docs.atlas.mongodb.com/security-manage-atlas-users/">
    creating a new user
  </a>
  specifically for this.
</p>

<p>
  It’s essential to get this right because you’re risking someone getting root
  privileges to your database and all of its data. Now would be an excellent
  time to get a colleague or friend to look over your shoulder!
</p>

<p>
  Hopefully, I’ve done enough to impress the importance and danger of this — but
  <a href="https://docs.atlas.mongodb.com/security-whitelist/">
    making your database open to the internet
  </a>
  will result in
  <b>/.netlify/functions/pokemon</b>
  returning the contents of our database!
</p>

<h2>Modify Data in our Database</h2>

<p>
  So we’ve got access to our database now, but what if we want to modify data in
  it? How do we get data from our Lambda function?
</p>

<p>
  Let’s modify our
  <code>pokemon.js</code>
  Lambda function to add a Pokémon when receiving a POST.
</p>

<Code
  language="javascript"
  code={`
// ./lambda_functions/pokemon.js

const pushToDatabase = async (db, data) => {
  const pokemonData = {
    name: data.name,
    number: data.number,
  };

  if (pokemonData.name && pokemonData.number) {
    await db.collection("pokemon").insertMany([data]);
    return { statusCode: 201 };
  } else {
    return { statusCode: 422 };
  }
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);

  switch (event.httpMethod) {
    case "GET":
      return queryDatabase(db);
    case "POST":
      return pushToDatabase(db, JSON.parse(event.body));
    default:
      return { statusCode: 400 };
  }
};
`}
/>

<p>
  Now we can test this by making a quick
  <code>POST</code>
  request to our endpoint:
</p>

<Code
  language="javascript"
  code={`
// test script

const postRequest = await fetch("/.netlify/functions/pokemon", {
  method: "POST",
  body: JSON.stringify({
    name: "Pikachu",
    number: 25,
  }),
});

console.log("POST request status code", postRequest.status);

const newGetRequest = await fetch("/.netlify/functions/pokemon");
const newListJson = await newGetRequest.json();

console.log("GET request new result", newListJson);`}
/>

<img
  src="./blog/netlify-mongodb/add-pikachu.png"
  alt="Making a POST request to add Pikachu to our DB"
  width="500"
  class="framed"
/>

<p>Huzzah!</p>

<h2>Summary</h2>

<p>You should now know how to:</p>

<ul>
  <li>
    <a
      href="https://github.com/stephencookdev/netlify-mongodb-example/commit/fb637bc528054779fdd50c5d9263c6ab6bef2b69"
    >
      Create a Netlify Lambda Function
    </a>
  </li>
  <li>Hook up your Netlify Lambda to your MongoDB database</li>
  <li>
    <a
      href="https://github.com/stephencookdev/netlify-mongodb-example/commit/0d99ae5b51b03af1b2b4f1134389ea8457661533"
    >
      Create a MongoDB query Lambda
    </a>
  </li>
  <li>
    <a
      href="https://github.com/stephencookdev/netlify-mongodb-example/commit/a0b63272da314781e173e7e91398fb2d0a71d5fb"
    >
      Create a MongoDB modification Lambda
    </a>
  </li>
</ul>

<p>
  But you can also use
  <a href="https://github.com/stephencookdev/netlify-mongodb-example">
    this example GitHub repo
  </a>
  for reference.
</p>
