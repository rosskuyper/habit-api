import Bugsnag from "@bugsnag/js";

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY!,
});

export default Bugsnag;
