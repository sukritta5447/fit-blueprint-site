import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { pageClasses } from "@/styles/articlePage.styles";
import { cn } from "@/utils/utils";

const fallbackSections = [
  {
    heading: "1. Independent Yet Affectionate",
    paragraphs: [
      "One of the most remarkable traits of cats is their balance between independence and affection. They enjoy their own space, but they also build strong emotional bonds with the people they trust.",
      "This mix of self-reliance and warmth is one reason cats feel so special as companions.",
    ],
  },
  {
    heading: "2. Playful Personalities",
    paragraphs: [
      "Cats are naturally curious and playful. They chase, climb, hide, and explore because these actions connect to their hunting instincts.",
      "Simple play sessions help indoor cats stay active, confident, and mentally stimulated.",
    ],
  },
  {
    heading: "3. Communication: Body Language",
    paragraphs: [
      "Cats communicate through subtle signals. A high tail often shows confidence, while slow blinking can be a sign of trust.",
      "Learning these cues helps you respond to your cat with more patience and care.",
    ],
  },
  {
    heading: "4. Health Benefits of Having a Cat",
    paragraphs: [
      "Spending time with a cat can reduce stress and create a calming daily routine. Their companionship can also help people feel less lonely.",
    ],
  },
  {
    heading: "5. A History with Humans",
    paragraphs: [
      "Cats have lived alongside humans for thousands of years. What began as a practical relationship around food storage and pest control eventually became companionship.",
      "Today, cats remain cherished family members in homes around the world.",
    ],
  },
];

export function ArticleBody({ article }) {
  const sections = article.sections ?? fallbackSections;

  return (
    <div>
      <div className={pageClasses.articleMeta}>
        <CategoryBadge>{article.category}</CategoryBadge>
        <time dateTime={article.isoDate}>{article.date}</time>
      </div>

      <h1 className={pageClasses.title}>{article.title}</h1>
      <p className={pageClasses.intro}>{article.excerpt}</p>

      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className={pageClasses.sectionHeading}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className={pageClasses.paragraph}>
              {paragraph}
            </p>
          ))}
          {section.bullets?.length > 0 && (
            <ul className={cn(pageClasses.paragraph, "list-disc space-y-2 pl-5")}>
              {section.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
