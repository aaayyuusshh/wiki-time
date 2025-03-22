# Unit Testing

## Testing Framework
Unit testing and mocking of external dependencies done with **[Jest](https://jestjs.io/)** and **[JSDOM](https://github.com/jsdom/jsdom)**.

---

## Test Data Source
For the tests, mocked HTML inspired by a very random Wikipedia article is used:  
📄 [**Nico Ditch**](https://en.wikipedia.org/wiki/Nico_Ditch)  (article about a literal ditch)

<blockquote>
<b>Fun Fact:</b> I found this article while searching for "short Wikipedia articles" on Google.  
I came across the <a href="https://en.wikipedia.org/wiki/Wikipedia:Very_short_featured_articles">Wikipedia: Very short featured articles</a> Wikipedia page that had a list of short articles and the 
above article was listed there 😂 
</blockquote>

---

## Why this approach?
- Jest and JSDOM together make unit testing and mocking seamless.
- Using real-world content (even a random article) ensures tests are practical and reflect actual usage scenarios.

---

Happy Testing! 🚀
