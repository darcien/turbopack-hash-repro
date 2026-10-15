/** Add your relevant code here for the issue to reproduce */
// event-emitter requires the d package. d requires es5-ext/string/#/contains.
import ee from "event-emitter";

export default function Home() {
  return <p>{typeof ee}</p>;
}
