# The Emotional Net Worth Plan

**Joe, 2026-09-11.** His framework, recorded in full because it is the source
that `emotional-net-worth.json` is built from, and because the language is his.

---

## What he wrote

> Drake,
>
> I had an incredible moment of clarity today, and I am so excited to share it
> with you because it gives language and structure to what we are creating
> together:
>
> **The Emotional Net Worth Plan**
>
> It is a daily system for cultivating and sustaining peace in the mind, love in
> the heart, happiness in the state of being, and personal freedom.
>
> A person meets with a financial advisor to evaluate assets, understand
> liabilities, establish goals, make consistent investments, and create a plan
> for long-term financial freedom. We are applying that same clear structure to
> emotional and spiritual well-being.
>
> **Emotional Net Worth = Emotional Assets − Emotional Liabilities**
>
> Our emotional assets include peace, love, joy, gratitude, faith, clarity,
> self-acceptance, purpose, meaningful connection, and freedom.
>
> Shame, blame, guilt, fear, anger, and resentment represent emotional energy
> ready to be acknowledged, understood, and integrated. Every emotion carries
> information, and our program provides practical tools for transforming that
> information into wisdom:
>
> Shame becomes self-acceptance.
> Blame becomes personal responsibility.
> Guilt becomes forgiveness.
> Fear becomes faith.
> Anger becomes purposeful power.
> Resentment becomes freedom.
>
> The Emotional Net Worth Plan creates a simple, repeatable process:
>
> **1. Assess.** A person creates an honest emotional balance sheet. What is
> currently increasing peace, love, and happiness? Which feelings desire
> compassionate attention? Where is emotional energy flowing?
>
> **2. Integrate the inner child.** The inner child is seen, heard, loved, and
> welcomed. The adult self becomes the loving internal parent who says:
>
> > "I see you. I hear you. I love you. You are safe with me. We are creating
> > together now."
>
> **3. Cultivate clarity through the ABCs.** The ABC programming gives people
> clear language for the qualities they desire to embody. Each letter becomes an
> emotional asset, a guiding principle, and an intentional action. The ABCs help
> people choose who they are being and where they are directing their attention
> each day.
>
> **4. Embody the work through The Answer®.** The Answer® brings everything into
> the body through intentional breathing, movement, mindfulness, and autonomic
> nervous system regulation.
>
> > The ABCs program the mind.
> > Inner-child integration opens the heart.
> > The Answer® engages the body.
> > Daily practice integrates the whole being.
>
> **5. Make daily emotional investments.** Fifteen intentional minutes of
> breathing, movement, gratitude, affirmative language, reflection, self-love,
> connection, and autosuggestion become the emotional equivalent of automatic
> investing. Small daily deposits compound into lasting inner wealth.
>
> **6. Review and rebalance.** A weekly Emotional Net Worth review allows each
> person to ask:
>
> > What increased my peace?
> > Where did I give and receive love?
> > What cultivated genuine happiness?
> > Which feeling is ready for loving attention?
> > What am I intentionally investing in this week?
>
> For the first time, I see a complete product, plan, and program coming
> together around what Jesus identified as the Greatest Commandment: to love God
> with our whole being and to love our neighbor as ourselves.
>
> This begins with learning how to experience and embody love within. From
> there, that love naturally flows into our relationships, families, circles,
> communities, and world.
>
> We are creating far more than an app or exercise program. We are creating a
> pathway people can follow, a daily practice that guides them home to peace,
> love, happiness, clarity, connection, and personal freedom.

---

## What this changes

**The plan is larger than Sharpen, and Sharpen sits inside it.** Sharpen is the
*meaningful connection* asset on Joe's list, built out. The Emotional Net Worth
Plan is the whole balance sheet.

### Three things already exist and were waiting for this

**The weekly review is the Circle beat.** Sharpen already gathers eight people
once a week on the movement boundary, and that gathering had a rhythm with no
content in it. Joe's five questions are what it is for. This is the single
largest fit, and it means the weekly layer stops being an empty container.

**The loving internal parent and the circle say the same thing.** Joe's inner
child line opens *"I see you. I hear you. I love you."* The circle answers a
raised hand with *"I see you. I am with you."* A member offers themselves the
words their circle offers them, and the other way round. That rhyme was arrived
at independently, which is the strongest evidence the two frameworks belong to
each other. It is asserted in `tools/validate.js` so a later edit to either
sentence surfaces the connection rather than quietly breaking it.

**The daily deposit is already fifteen minutes.** Joe's step five describes the
practice that has been running since March.

### What is genuinely new

The **balance sheet** as a member-facing object, the **six transformations**, and
the **inner-child integration** as an explicit step. None of these exist in the
app today. The transformations in particular give the appreciation lines a
reason to exist beyond good manners: language drifts toward the left side of
those six pairs on its own, which is exactly what Joe said when he asked for
ready-written words.

---

## The language collision, and how it is handled

Three of the six starting emotions — **shame, guilt and fear** — are Tier 2
words in `tools/lib/affirmative.js`. Tier 2 exists to catch copy that paints
absence, and `--strict` exits on warnings, so Joe's own framework would fail the
gate his rule inspired.

Naming them here is the mechanism rather than a lapse. The framework's whole
claim is that an emotion carries information and that meeting it by name is what
turns it into an asset. A pair that could never say where it starts could never
show where it leads.

So there is one carve-out, kept as narrow as it can be:

- It applies to **one field**, the `from` of a transformation pair.
- That field is checked against a **closed list** of the six Joe named.
- The destination, the line beside it, and every other string are scanned
  exactly as before.
- **Tier 1 still blocks everywhere**, including here.

It is implemented and commented in `tools/validate.js`. Any widening of it
should need a conversation.

---

## Open, and Joe's to answer

1. **Where the balance sheet lives.** Assess is a daily step. The practice is
   fifteen minutes and its whole constraint is low activation energy. Does the
   daily assess become a question inside the existing journal, or a surface of
   its own?
2. **Whether the six transformations are member-facing or a teaching frame.**
   Showing a member a chip that says "shame" is a real choice, and it may belong
   in the weekly review with an anchor present rather than in a solo daily loop.
3. **Inner-child integration** is the step with no home in the app at all. It is
   also the most tender. It may want Joe's voice, in audio, rather than text.
4. **The ABCs as emotional assets.** Joe says each letter becomes an asset, a
   principle and an action. The twenty-eight letters already exist. Mapping each
   to an asset is content work only he can do.

Everything already answered is built: the name, the three rest doorways, three
rotating appreciation lines plus Customize, and eight as the circle maximum.
