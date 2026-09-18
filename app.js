/* =========================================================
   CLOUDADMIN PREP — APPLICATION LOGIC
   Pure application logic: rendering, navigation, progress
   tracking, and event wiring. Curriculum content lives in
   data/meta.js and every data/*.js track file, merged by
   data/index.js into the globals LESSONS, QUESTIONS, LABS
   (plus data/tickets.js's TICKETS), loaded before this file
   (see index.html) — alongside TOPIC_NAMES, EXAM_TOPICS,
   EXAM_WEIGHTS, EXAM_LEVELS, TICKET_DIFFICULTIES.

   Three content tracks share this app: Networking Fundamentals
   ("netfund") and Automation & IaC ("automation") are real-world
   Cloud Engineer tracks, not scored AZ-104 domains. The
   "AZ-104 readiness" card on the home screen must only reflect
   AZ-104-relevant activity (foundations + the 5 exam topics) —
   see AZ104_SCOPE_TOPICS / AZ104_LESSONS / AZ104_LABS /
   getAz104Stats() below — so adding these tracks never inflates
   or dilutes the AZ-104 readiness number.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("CloudAdmin Prep v4.0 loaded.");

  const STORAGE_KEY = "cloudAdminPrepV2";
  const LEGACY_KEY = "cloudAdminPrepV1";
  const JOURNAL_KEY = "cloudAdminPrepJournalV1";

  // Scope used to keep the "AZ-104 readiness" card honest now that
  // Networking Fundamentals and Automation & IaC exist alongside it.
  const AZ104_SCOPE_TOPICS = new Set(["foundations", ...EXAM_TOPICS]);
  const AZ104_LESSONS = LESSONS.filter((lesson) => AZ104_SCOPE_TOPICS.has(lesson.topic));
  const AZ104_LABS = LABS.filter((lab) => AZ104_SCOPE_TOPICS.has(lab.topic));

  function getAz104Stats() {
    let answered = 0;
    let correct = 0;
    AZ104_SCOPE_TOPICS.forEach((topic) => {
      const stats = progress.topicStats[topic];
      if (stats) {
        answered += stats.answered;
        correct += stats.correct;
      }
    });
    return { answered, correct };
  }

  const emptyTopicStats = () =>
    Object.fromEntries(
      ["foundations", ...EXAM_TOPICS, "netfund", "automation"].map((topic) => [
        topic,
        { answered: 0, correct: 0 },
      ]),
    );

  const emptyLessonStats = () =>
    Object.fromEntries(
      LESSONS.map((lesson) => [lesson.id, { answered: 0, correct: 0 }]),
    );

  const DEFAULT_PROGRESS = {
    questionsAnswered: 0,
    correctAnswers: 0,
    completedLessons: [],
    completedLabs: [],
    completedTickets: [],
    lastStudyLesson: "netfund-what-is-a-network",
    topicStats: emptyTopicStats(),
    lessonStats: emptyLessonStats(),
    labScores: {},
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function loadProgress() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        const parsed = JSON.parse(current);
        return {
          ...clone(DEFAULT_PROGRESS),
          ...parsed,
          topicStats: {
            ...emptyTopicStats(),
            ...(parsed.topicStats || {}),
          },
          lessonStats: {
            ...emptyLessonStats(),
            ...(parsed.lessonStats || {}),
          },
          labScores: { ...(parsed.labScores || {}) },
          completedLessons: Array.isArray(parsed.completedLessons)
            ? parsed.completedLessons
            : [],
          completedLabs: Array.isArray(parsed.completedLabs)
            ? parsed.completedLabs
            : [],
          completedTickets: Array.isArray(parsed.completedTickets)
            ? parsed.completedTickets
            : [],
        };
      }

      // Carry forward practice history from v1 without falsely marking the
      // detailed v2/v3 lessons complete.
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const old = JSON.parse(legacy);
        return {
          ...clone(DEFAULT_PROGRESS),
          questionsAnswered: old.questionsAnswered || 0,
          correctAnswers: old.correctAnswers || 0,
          topicStats: {
            ...emptyTopicStats(),
            ...(old.topicStats || {}),
          },
          completedLabs: Array.isArray(old.completedLabs)
            ? old.completedLabs.filter((id) =>
                LABS.some((lab) => lab.id === id),
              )
            : [],
        };
      }
    } catch (error) {
      console.warn("CloudAdmin Prep could not load progress.", error);
    }
    return clone(DEFAULT_PROGRESS);
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("CloudAdmin Prep could not save progress.", error);
    }
  }

  let progress = loadProgress();

  const get = (id) => document.getElementById(id);
  const elements = {
    screens: Array.from(document.querySelectorAll(".screen")),
    navButtons: Array.from(document.querySelectorAll(".nav-button")),
    pathCards: Array.from(document.querySelectorAll(".path-card")),
    brandButton: get("brand-button"),
    continueLearningButton: get("continue-learning-button"),
    quickPracticeButton: get("quick-practice-button"),
    readinessRing: get("readiness-ring"),
    readinessPercent: get("readiness-percent"),
    progressStatus: get("progress-status"),
    recommendedTopic: get("recommended-topic"),
    recommendedNote: get("recommended-note"),
    questionsAnswered: get("questions-answered"),
    overallAccuracy: get("overall-accuracy"),
    topicsCompleted: get("topics-completed"),
    identityProgress: get("identity-progress"),
    storageProgress: get("storage-progress"),
    computeProgress: get("compute-progress"),
    networkingProgress: get("networking-progress"),
    monitoringProgress: get("monitoring-progress"),
    netfundProgress: get("netfund-progress"),
    automationProgress: get("automation-progress"),
    studyTopicList: get("study-topic-list"),
    lessonDomain: get("lesson-domain"),
    lessonExamLevel: get("lesson-exam-level"),
    lessonProgressLabel: get("lesson-progress-label"),
    lessonTitle: get("lesson-title"),
    lessonSummary: get("lesson-summary"),
    lessonPoints: get("lesson-points"),
    lessonExampleText: get("lesson-example-text"),
    lessonRemember: get("lesson-remember"),
    lessonKnowledgeCheck: get("lesson-knowledge-check"),
    lessonRelatedLab: get("lesson-related-lab"),
    previousLessonButton: get("previous-lesson-button"),
    lessonCheckButton: get("lesson-check-button"),
    practiceTopicOptions: get("practice-topic-options"),
    practiceModeOptions: get("practice-mode-options"),
    questionCountOptions: get("question-count-options"),
    practiceSummary: get("practice-summary"),
    startPracticeButton: get("start-practice-button"),
    quizTopic: get("quiz-topic"),
    quizMode: get("quiz-mode"),
    quitQuizButton: get("quit-quiz-button"),
    questionCount: get("question-count"),
    liveCorrect: get("live-correct"),
    liveAccuracy: get("live-accuracy"),
    timerCard: get("timer-card"),
    timer: get("timer"),
    quizProgressLabel: get("quiz-progress-label"),
    quizProgressBar: get("quiz-progress-bar"),
    questionNumber: get("question-number"),
    questionOverline: get("question-overline"),
    questionText: get("question-text"),
    answerOptions: get("answer-options"),
    answerFeedback: get("answer-feedback"),
    feedbackIcon: get("feedback-icon"),
    feedbackTitle: get("feedback-title"),
    feedbackText: get("feedback-text"),
    answerBreakdown: get("answer-breakdown"),
    nextQuestionButton: get("next-question-button"),
    resultsTitle: get("results-title"),
    resultsMessage: get("results-message"),
    resultsAccuracy: get("results-accuracy"),
    resultsCorrect: get("results-correct"),
    resultsTopic: get("results-topic"),
    resultsMode: get("results-mode"),
    resultsReviewCount: get("results-review-count"),
    missedReviewCard: get("missed-review-card"),
    missedReviewToggle: get("missed-review-toggle"),
    missedReviewLabel: get("missed-review-label"),
    missedReviewList: get("missed-review-list"),
    reviewToggleIcon: get("review-toggle-icon"),
    practiceAgainButton: get("practice-again-button"),
    studyWeakButton: get("study-weak-button"),
    resultsHomeButton: get("results-home-button"),
    labList: get("lab-list"),
    weakestTopic: get("weakest-topic"),
    weakestTopicNote: get("weakest-topic-note"),
    practiceWeakAreaButton: get("practice-weak-area-button"),
    weakAreaList: get("weak-area-list"),
    toast: get("toast"),
    ticketList: get("ticket-list"),
    journalForm: get("journal-form"),
    journalTitle: get("journal-title"),
    journalProblem: get("journal-problem"),
    journalEnvironment: get("journal-environment"),
    journalAction: get("journal-action"),
    journalValidation: get("journal-validation"),
    journalLessons: get("journal-lessons"),
    journalEntryList: get("journal-entry-list"),
  };

  const state = {
    currentStudyLesson: LESSONS.some(
      (lesson) => lesson.id === progress.lastStudyLesson,
    )
      ? progress.lastStudyLesson
      : LESSONS[0].id,
    practiceSettings: { topic: "mixed", mode: "practice", count: 10 },
    sessionSettings: { topic: "mixed", mode: "practice", count: 10 },
    questions: [],
    currentIndex: 0,
    correct: 0,
    answered: false,
    answers: [],
    timerId: null,
    timeLeft: 0,
    fromLesson: false,
    lessonCheckId: null,
    currentLab: null,
    labAttempts: 0,
    labConfigPassed: false,
    lastAccuracy: 0,
    currentTicket: null,
    ticketStepIndex: 0,
    ticketStepAnswered: false,
    ticketMistakes: 0,
  };

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function calculateAccuracy(correct, answered) {
    return answered ? Math.round((correct / answered) * 100) : 0;
  }

  function getTopicQuestions(topic) {
    if (topic === "mixed") {
      // The weighted AZ-104 mixed exam/practice pool must stay scoped to the
      // 5 graded exam domains — Networking Fundamentals and Automation & IaC
      // questions are real-world content, not AZ-104 objectives.
      return QUESTIONS.filter((question) => EXAM_TOPICS.includes(question.topic));
    }
    return QUESTIONS.filter((question) => question.topic === topic);
  }

  function getTopicAccuracy(topic) {
    const stats = progress.topicStats[topic];
    return stats?.answered
      ? calculateAccuracy(stats.correct, stats.answered)
      : 0;
  }

  function getDomainLessonProgress(topic) {
    const domainLessons = LESSONS.filter((lesson) => lesson.topic === topic);
    if (!domainLessons.length) return 0;
    const done = domainLessons.filter((lesson) =>
      progress.completedLessons.includes(lesson.id),
    ).length;
    return Math.round((done / domainLessons.length) * 100);
  }

  function getDomainMastery(topic) {
    const lessonPart = getDomainLessonProgress(topic);
    const stats = progress.topicStats[topic];
    if (!stats?.answered) return Math.round(lessonPart * 0.55);
    return Math.round(lessonPart * 0.45 + getTopicAccuracy(topic) * 0.55);
  }

  function getReadinessScore() {
    // Scoped to AZ-104 content only — Networking Fundamentals and
    // Automation & IaC activity must never inflate (or dilute) this number.
    const az104CompletedLessons = progress.completedLessons.filter((id) =>
      AZ104_SCOPE_TOPICS.has(LESSONS.find((lesson) => lesson.id === id)?.topic),
    ).length;
    const az104CompletedLabs = progress.completedLabs.filter((id) =>
      AZ104_SCOPE_TOPICS.has(LABS.find((lab) => lab.id === id)?.topic),
    ).length;
    const az104Stats = getAz104Stats();

    const lessonPart = (az104CompletedLessons / AZ104_LESSONS.length) * 30;
    const labPart = (az104CompletedLabs / AZ104_LABS.length) * 25;
    const volumePart = (Math.min(az104Stats.answered, 120) / 120) * 20;
    const accuracy = calculateAccuracy(az104Stats.correct, az104Stats.answered);
    const accuracyPart = az104Stats.answered >= 10 ? (accuracy / 100) * 25 : 0;
    return Math.min(
      100,
      Math.round(lessonPart + labPart + volumePart + accuracyPart),
    );
  }

  function getWeakestTopic() {
    const attempted = EXAM_TOPICS.map((topic) => ({
      topic,
      ...progress.topicStats[topic],
      accuracy: getTopicAccuracy(topic),
    })).filter((item) => item.answered > 0);

    if (!attempted.length) return null;
    attempted.sort(
      (a, b) => a.accuracy - b.accuracy || b.answered - a.answered,
    );
    return attempted[0];
  }

  function getWeakestLesson(topic = null) {
    const pool = LESSONS.filter(
      (lesson) =>
        lesson.topic !== "foundations" && (!topic || lesson.topic === topic),
    )
      .map((lesson) => {
        const stats = progress.lessonStats[lesson.id] || {
          answered: 0,
          correct: 0,
        };
        return {
          lesson,
          answered: stats.answered,
          accuracy: calculateAccuracy(stats.correct, stats.answered),
        };
      })
      .filter((item) => item.answered > 0);

    if (!pool.length) return null;
    pool.sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
    return pool[0];
  }

  function getRecommendedLesson() {
    const incomplete = LESSONS.find(
      (lesson) => !progress.completedLessons.includes(lesson.id),
    );
    if (incomplete) return incomplete;
    const weak = getWeakestLesson();
    return (
      weak?.lesson || LESSONS.find((lesson) => lesson.topic === "identity")
    );
  }

  let toastTimer = null;
  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = setTimeout(
      () => elements.toast.classList.remove("show"),
      2600,
    );
  }

  function showScreen(screenId, navScreenId = screenId) {
    clearInterval(state.timerId);
    elements.screens.forEach((screen) => screen.classList.add("hide"));
    const target = get(screenId);
    if (!target) return;
    target.classList.remove("hide");
    elements.navButtons.forEach((button) =>
      button.classList.toggle("active", button.dataset.screen === navScreenId),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateHomeProgress() {
    // "AZ-104 readiness" and its stats are scoped to AZ-104 content only —
    // see the header comment on AZ104_SCOPE_TOPICS for why.
    const az104Stats = getAz104Stats();
    const accuracy = calculateAccuracy(az104Stats.correct, az104Stats.answered);
    const readiness = getReadinessScore();
    elements.readinessRing.style.setProperty("--progress", readiness);
    elements.readinessPercent.textContent = `${readiness}%`;

    if (readiness < 25)
      elements.progressStatus.textContent = "Building foundation";
    else if (readiness < 50)
      elements.progressStatus.textContent = "Learning the job";
    else if (readiness < 75)
      elements.progressStatus.textContent = "Building exam skill";
    else if (readiness < 90)
      elements.progressStatus.textContent = "Near exam-ready";
    else elements.progressStatus.textContent = "Strong study readiness";

    const az104CompletedLessons = progress.completedLessons.filter((id) =>
      AZ104_SCOPE_TOPICS.has(LESSONS.find((lesson) => lesson.id === id)?.topic),
    ).length;

    elements.questionsAnswered.textContent = az104Stats.answered;
    elements.overallAccuracy.textContent = `${accuracy}%`;
    elements.topicsCompleted.textContent = `${az104CompletedLessons} / ${AZ104_LESSONS.length}`;

    const recommended = getRecommendedLesson();
    elements.recommendedTopic.textContent = recommended.title;
    elements.recommendedNote.textContent =
      az104CompletedLessons === AZ104_LESSONS.length
        ? "Every AZ-104 lesson is complete. Keep drilling weak subtopics, simulator labs, and the Work Simulator. Readiness is a study-progress indicator, not a guaranteed exam score."
        : recommended.summary;

    elements.identityProgress.style.width = `${getDomainMastery("identity")}%`;
    elements.storageProgress.style.width = `${getDomainMastery("storage")}%`;
    elements.computeProgress.style.width = `${getDomainMastery("compute")}%`;
    elements.networkingProgress.style.width = `${getDomainMastery("networking")}%`;
    elements.monitoringProgress.style.width = `${getDomainMastery("monitoring")}%`;
    elements.netfundProgress.style.width = `${getDomainMastery("netfund")}%`;
    elements.automationProgress.style.width = `${getDomainMastery("automation")}%`;
  }

  function renderStudyTopicList() {
    elements.studyTopicList.innerHTML = "";
    let lastTopic = null;

    LESSONS.forEach((lesson, index) => {
      if (lesson.topic !== lastTopic) {
        const group = document.createElement("div");
        group.className = "topic-group-label";
        group.textContent = TOPIC_NAMES[lesson.topic];
        elements.studyTopicList.appendChild(group);
        lastTopic = lesson.topic;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "topic-button";
      button.dataset.lesson = lesson.id;
      button.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${lesson.title}</strong>
      `;
      button.classList.toggle("active", lesson.id === state.currentStudyLesson);
      button.classList.toggle(
        "complete",
        progress.completedLessons.includes(lesson.id),
      );
      button.addEventListener("click", () => selectStudyLesson(lesson.id));
      elements.studyTopicList.appendChild(button);
    });
  }

  function selectStudyLesson(lessonId) {
    if (!LESSONS.some((lesson) => lesson.id === lessonId)) return;
    state.currentStudyLesson = lessonId;
    progress.lastStudyLesson = lessonId;
    saveProgress();
    renderStudyTopicList();
    renderLesson();
  }

  // ---------------------------------------------------------
  // LESSON RENDERING
  // ---------------------------------------------------------

  function renderTerminology(terminology) {
    if (!terminology?.length) return "";
    return `
      <div class="lesson-teach-card terminology-card">
        <span class="teach-label">Key terminology</span>
        <dl class="terminology-list">
          ${terminology
            .map(
              (item) => `
                <div class="terminology-item">
                  <dt>${escapeHtml(item.term)}</dt>
                  <dd>${escapeHtml(item.definition)}</dd>
                </div>`,
            )
            .join("")}
        </dl>
      </div>`;
  }

  function renderDistinctions(distinctions) {
    if (!distinctions?.length) return "";
    return `
      <div class="exam-trap-card distinctions-card">
        <span class="teach-label">Don't confuse these</span>
        <div class="distinctions-list">
          ${distinctions
            .map(
              (item) => `
                <div class="distinction-item">
                  <strong><span>${escapeHtml(item.a)}</span> vs <span>${escapeHtml(item.b)}</span></strong>
                  <p>${escapeHtml(item.note)}</p>
                </div>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderPortalWalkthrough(portalSteps) {
    if (!portalSteps?.length) return "";
    return `
      <div class="lesson-teach-card portal-walkthrough-card">
        <span class="teach-label">Azure Portal walkthrough</span>
        <ol class="portal-steps">
          ${portalSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </div>`;
  }

  function renderCommandBlock(label, commands) {
    if (!commands?.length) return "";
    return `
      <div class="command-card">
        <span class="teach-label">${escapeHtml(label)}</span>
        <div class="command-list">
          ${commands
            .map(
              (item) => `
                <div class="command-item">
                  <code>${escapeHtml(item.command)}</code>
                  <p>${escapeHtml(item.explanation)}</p>
                </div>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderListCard(className, label, items) {
    if (!items?.length) return "";
    return `
      <div class="${className}">
        <span class="teach-label">${escapeHtml(label)}</span>
        <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>`;
  }

  function renderDiagram(diagram) {
    if (!diagram) return "";
    return `
      <div class="lesson-teach-card diagram-card">
        <span class="teach-label">Diagram</span>
        <pre class="network-diagram">${escapeHtml(diagram)}</pre>
      </div>`;
  }

  function renderAzureConnection(text) {
    if (!text) return "";
    return `
      <div class="lesson-teach-card azure-connection-card">
        <span class="teach-label">How this relates to Azure</span>
        <p>${escapeHtml(text)}</p>
      </div>`;
  }

  function renderLesson() {
    const index = LESSONS.findIndex(
      (lesson) => lesson.id === state.currentStudyLesson,
    );
    const lesson = LESSONS[index];
    if (!lesson) return;

    elements.lessonDomain.textContent = lesson.domain;
    elements.lessonExamLevel.textContent =
      EXAM_LEVELS[lesson.examLevel] || "AZ-104 objective";
    elements.lessonProgressLabel.textContent = `Lesson ${index + 1} of ${LESSONS.length}`;
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonSummary.textContent = lesson.summary;

    elements.lessonPoints.innerHTML = `
      <div class="lesson-teach-card plain-card">
        <span class="teach-label">Plain-English version</span>
        <p>${escapeHtml(lesson.plain)}</p>
      </div>
      ${
        lesson.why
          ? `<div class="lesson-teach-card why-card">
               <span class="teach-label">Why this exists</span>
               <p>${escapeHtml(lesson.why)}</p>
             </div>`
          : ""
      }
      <div class="lesson-teach-card analogy-card">
        <span class="teach-label">Mental model</span>
        <p>${escapeHtml(lesson.analogy)}</p>
      </div>
      <div class="lesson-key-list">
        ${lesson.points
          .map(
            (point) => `
              <div class="lesson-point">
                <span>✓</span>
                <p>${escapeHtml(point)}</p>
              </div>`,
          )
          .join("")}
      </div>
      ${renderDiagram(lesson.diagram)}
      ${renderTerminology(lesson.terminology)}
      ${renderDistinctions(lesson.distinctions)}
      ${
        lesson.realWorldExample
          ? `<div class="lesson-teach-card example-card">
               <span class="teach-label">Real-world example</span>
               <p>${escapeHtml(lesson.realWorldExample)}</p>
             </div>`
          : ""
      }
      ${renderAzureConnection(lesson.azureConnection)}
      ${renderPortalWalkthrough(lesson.portalSteps)}
      ${renderCommandBlock("Azure CLI", lesson.cli)}
      ${renderCommandBlock("Azure PowerShell", lesson.powershell)}
      ${renderCommandBlock("Python", lesson.python)}
      ${renderCommandBlock("YAML", lesson.yaml)}
      ${renderCommandBlock("JSON", lesson.json)}
      ${renderCommandBlock("Git", lesson.git)}
      ${renderListCard("exam-trap-card", "Common mistakes", lesson.commonMistakes)}
      <div class="exam-trap-card">
        <span class="teach-label">${lesson.examLevel === "career" ? "Things that trip people up" : "Common exam traps"}</span>
        <ul>${lesson.traps.map((trap) => `<li>${escapeHtml(trap)}</li>`).join("")}</ul>
      </div>
      ${renderListCard("exam-trap-card exam-tips-card", "AZ-104 exam tips", lesson.examTips)}
      ${
        lesson.portalPath
          ? `<div class="portal-path"><strong>Where you would find it in Azure:</strong> ${escapeHtml(lesson.portalPath)}</div>`
          : ""
      }
    `;

    elements.lessonExampleText.textContent = lesson.scenario;
    elements.lessonRemember.textContent = lesson.remember;
    elements.previousLessonButton.disabled = index === 0;
    elements.previousLessonButton.style.opacity = index === 0 ? "0.4" : "1";
    elements.lessonCheckButton.textContent = progress.completedLessons.includes(
      lesson.id,
    )
      ? "Practice This Lesson Again →"
      : "Check What I Learned →";

    renderKnowledgeCheck(lesson);
    renderRelatedLabCard(lesson);
  }

  function renderKnowledgeCheck(lesson) {
    const container = elements.lessonKnowledgeCheck;
    if (!lesson.knowledgeCheck?.length) {
      container.innerHTML = "";
      container.classList.add("hide");
      return;
    }
    container.classList.remove("hide");
    container.innerHTML = `
      <div class="knowledge-check-heading">
        <span class="teach-label">Quick knowledge check</span>
        <small>Ungraded — just to verify understanding before you continue.</small>
      </div>
      <div class="knowledge-check-list">
        ${lesson.knowledgeCheck
          .map(
            (item, index) => `
              <div class="knowledge-check-item" data-kc-index="${index}">
                <p class="knowledge-check-question">${escapeHtml(item.question)}</p>
                <div class="knowledge-check-options">
                  ${item.options
                    .map(
                      (option) => `
                        <button type="button" class="kc-option" data-kc-answer="${escapeHtml(option)}">
                          ${escapeHtml(option)}
                        </button>`,
                    )
                    .join("")}
                </div>
                <div class="knowledge-check-feedback hide"></div>
              </div>`,
          )
          .join("")}
      </div>
    `;

    container
      .querySelectorAll(".knowledge-check-item")
      .forEach((itemEl, index) => {
        const item = lesson.knowledgeCheck[index];
        const feedback = itemEl.querySelector(".knowledge-check-feedback");
        const optionButtons = itemEl.querySelectorAll(".kc-option");
        optionButtons.forEach((button) => {
          button.addEventListener("click", () => {
            if (itemEl.dataset.answered === "true") return;
            itemEl.dataset.answered = "true";
            const isCorrect = button.dataset.kcAnswer === item.answer;
            optionButtons.forEach((otherButton) => {
              otherButton.disabled = true;
              if (otherButton.dataset.kcAnswer === item.answer) {
                otherButton.classList.add("correct");
              } else if (otherButton === button) {
                otherButton.classList.add("wrong");
              } else {
                otherButton.classList.add("dimmed");
              }
            });
            feedback.classList.remove("hide", "wrong");
            if (!isCorrect) feedback.classList.add("wrong");
            feedback.innerHTML = `<strong>${isCorrect ? "Correct." : "Not quite."}</strong> ${escapeHtml(item.explanation)}`;
          });
        });
      });
  }

  function renderRelatedLabCard(lesson) {
    const container = elements.lessonRelatedLab;
    const lab = lesson.relatedLab
      ? LABS.find((item) => item.id === lesson.relatedLab)
      : null;
    if (!lab) {
      container.innerHTML = "";
      container.classList.add("hide");
      return;
    }
    const done = progress.completedLabs.includes(lab.id);
    container.classList.remove("hide");
    container.innerHTML = `
      <span class="teach-label">Apply it in the simulator</span>
      <p><strong>${escapeHtml(lab.title)}</strong> — ${escapeHtml(lab.description)}</p>
      <button type="button" class="secondary-button" data-related-lab="${lab.id}">
        ${done ? "Practice this lab again" : "Try the related simulator lab"} →
      </button>
    `;
  }

  function openStudy(lessonId) {
    selectStudyLesson(lessonId);
    showScreen("study-screen");
  }

  // ---------------------------------------------------------
  // PRACTICE BUILDER
  // ---------------------------------------------------------

  function syncPracticeButtons() {
    elements.practiceTopicOptions
      .querySelectorAll(".selection-card")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          button.dataset.topic === state.practiceSettings.topic,
        ),
      );

    elements.practiceModeOptions
      .querySelectorAll(".mode-option")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          button.dataset.mode === state.practiceSettings.mode,
        ),
      );

    updateCountAvailability();

    elements.questionCountOptions
      .querySelectorAll("button")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          Number(button.dataset.count) === state.practiceSettings.count,
        ),
      );

    updatePracticeSummary();
  }

  function updateCountAvailability() {
    const available = getTopicQuestions(state.practiceSettings.topic).length;
    const buttons = Array.from(
      elements.questionCountOptions.querySelectorAll("button"),
    );

    buttons.forEach((button) => {
      const count = Number(button.dataset.count);
      const disabled = count > available;
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.35" : "1";
      button.style.cursor = disabled ? "not-allowed" : "pointer";
      if (count === 50 && state.practiceSettings.topic !== "mixed") {
        button.title = "50-question simulation is available for Mixed AZ-104.";
      } else {
        button.title = "";
      }
    });

    if (state.practiceSettings.count > available) {
      const valid = buttons
        .map((button) => Number(button.dataset.count))
        .filter((count) => count <= available);
      state.practiceSettings.count = Math.max(...valid);
    }
  }

  function updatePracticeSummary() {
    const mode =
      state.practiceSettings.mode === "exam" ? "Exam Simulation" : "Practice";
    elements.practiceSummary.textContent = `${state.practiceSettings.count} ${TOPIC_NAMES[state.practiceSettings.topic]} · ${mode}`;
  }

  function buildWeightedMixedExam(count) {
    const selected = [];
    let used = 0;
    const allocations = {};

    EXAM_TOPICS.forEach((topic) => {
      allocations[topic] = Math.floor(count * EXAM_WEIGHTS[topic]);
      used += allocations[topic];
    });

    let remaining = count - used;
    const byWeight = [...EXAM_TOPICS].sort(
      (a, b) => EXAM_WEIGHTS[b] - EXAM_WEIGHTS[a],
    );
    let cursor = 0;
    while (remaining > 0) {
      allocations[byWeight[cursor % byWeight.length]] += 1;
      remaining -= 1;
      cursor += 1;
    }

    EXAM_TOPICS.forEach((topic) => {
      selected.push(
        ...shuffle(getTopicQuestions(topic)).slice(0, allocations[topic]),
      );
    });

    if (selected.length < count) {
      const ids = new Set(selected.map((item) => item.id));
      const extras = shuffle(getTopicQuestions("mixed")).filter(
        (item) => !ids.has(item.id),
      );
      selected.push(...extras.slice(0, count - selected.length));
    }

    return shuffle(selected).slice(0, count);
  }

  function prepareQuestions(lessonId = null) {
    let pool;

    if (lessonId) {
      // A Lesson Check may only test material taught in THIS lesson —
      // never pad with questions from other lessons in the same topic,
      // even if that means a shorter check for a lesson with few
      // dedicated questions. Mixed/topic practice and the exam
      // simulation are the intentional places for cross-lesson pools.
      pool = shuffle(
        QUESTIONS.filter((item) => item.lessonId === lessonId),
      ).slice(0, 5);
    } else if (
      state.practiceSettings.mode === "exam" &&
      state.practiceSettings.topic === "mixed"
    ) {
      pool = buildWeightedMixedExam(state.practiceSettings.count);
    } else {
      pool = shuffle(getTopicQuestions(state.practiceSettings.topic)).slice(
        0,
        state.practiceSettings.count,
      );
    }

    return pool.map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));
  }

  function startPractice(fromLesson = false, lessonId = null) {
    clearInterval(state.timerId);

    const lesson = lessonId
      ? LESSONS.find((item) => item.id === lessonId)
      : null;

    state.sessionSettings = lesson
      ? { topic: lesson.topic, mode: "practice", count: 5 }
      : { ...state.practiceSettings };

    state.questions = prepareQuestions(lessonId);
    if (!state.questions.length) {
      showToast("No questions are available for that selection.");
      return;
    }

    state.currentIndex = 0;
    state.correct = 0;
    state.answered = false;
    state.answers = [];
    state.fromLesson = fromLesson;
    state.lessonCheckId = lessonId;

    showScreen("quiz-screen", fromLesson ? "study-screen" : "practice-screen");
    displayQuestion();
  }

  function startQuestionTimer() {
    clearInterval(state.timerId);
    state.timeLeft = 75;
    elements.timer.textContent = state.timeLeft;
    state.timerId = setInterval(() => {
      state.timeLeft -= 1;
      elements.timer.textContent = state.timeLeft;
      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        handleTimeout();
      }
    }, 1000);
  }

  function displayQuestion() {
    clearInterval(state.timerId);
    state.answered = false;
    elements.nextQuestionButton.disabled = true;
    elements.answerFeedback.className = "feedback-panel hide";
    elements.answerBreakdown.className = "answer-breakdown hide";
    elements.answerBreakdown.innerHTML = "";

    const question = state.questions[state.currentIndex];
    const position = state.currentIndex + 1;
    const total = state.questions.length;
    const progressPercent = Math.round((position / total) * 100);

    elements.quizTopic.textContent = TOPIC_NAMES[question.topic];
    elements.quizMode.textContent =
      state.sessionSettings.mode === "exam"
        ? "Exam Simulation"
        : state.fromLesson
          ? "Lesson Check"
          : "Practice";

    elements.questionCount.textContent = `${position} / ${total}`;
    elements.liveCorrect.textContent = state.correct;
    elements.liveAccuracy.textContent = `${calculateAccuracy(state.correct, state.currentIndex)}%`;
    elements.quizProgressLabel.textContent = `${progressPercent}%`;
    elements.quizProgressBar.style.width = `${progressPercent}%`;
    elements.questionNumber.textContent = String(position).padStart(2, "0");
    elements.questionOverline.textContent = `${TOPIC_NAMES[question.topic].toUpperCase()} · ${question.difficulty.toUpperCase()}`;
    elements.questionText.textContent = question.question;
    elements.answerOptions.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.answer = option;
      button.innerHTML = `
        <span>${index + 1}</span>
        <strong>${option}</strong>
      `;
      elements.answerOptions.appendChild(button);
    });

    const examMode = state.sessionSettings.mode === "exam";
    elements.timerCard.classList.toggle("hide", !examMode);
    if (examMode) startQuestionTimer();
  }

  function buildAnswerBreakdownHtml(question, selectedAnswer) {
    const explanations = question.optionExplanations || {};
    return `
      <div class="breakdown-heading">
        <span>Concept: ${escapeHtml(question.concept || TOPIC_NAMES[question.topic])}</span>
      </div>
      <ul class="breakdown-list">
        ${question.options
          .map((option) => {
            const isCorrect = option === question.answer;
            const isSelected = option === selectedAnswer;
            const stateClass = isCorrect
              ? "correct"
              : isSelected
                ? "wrong"
                : "";
            const icon = isCorrect ? "✓" : isSelected ? "✗" : "•";
            return `
              <li class="${stateClass}">
                <span class="breakdown-icon">${icon}</span>
                <div>
                  <strong>${escapeHtml(option)}</strong>
                  <p>${escapeHtml(explanations[option] || "")}</p>
                </div>
              </li>`;
          })
          .join("")}
      </ul>
    `;
  }

  function answerQuestion(selectedAnswer, selectedButton) {
    if (state.answered) return;
    clearInterval(state.timerId);
    state.answered = true;

    const question = state.questions[state.currentIndex];
    const correct = selectedAnswer === question.answer;
    if (correct) state.correct += 1;

    state.answers.push({
      ...question,
      selected: selectedAnswer,
      correct,
      timedOut: false,
    });

    const buttons = elements.answerOptions.querySelectorAll(".answer-button");
    buttons.forEach((button) => {
      button.disabled = true;
      if (state.sessionSettings.mode === "practice") {
        if (button.dataset.answer === question.answer)
          button.classList.add("correct");
        else if (button === selectedButton && !correct)
          button.classList.add("wrong");
        else button.classList.add("dimmed");
      }
    });

    if (state.sessionSettings.mode === "exam") {
      selectedButton.classList.add("exam-selected");
    } else {
      showPracticeFeedback(question, selectedAnswer, correct);
    }

    elements.liveCorrect.textContent = state.correct;
    elements.liveAccuracy.textContent = `${calculateAccuracy(state.correct, state.currentIndex + 1)}%`;
    elements.nextQuestionButton.disabled = false;
  }

  function showPracticeFeedback(question, selectedAnswer, correct) {
    elements.answerFeedback.className = correct
      ? "feedback-panel"
      : "feedback-panel wrong";
    elements.feedbackIcon.textContent = correct ? "✓" : "!";
    elements.feedbackTitle.textContent = correct
      ? "Correct — now lock in why."
      : "Not this one — use the clue.";

    elements.feedbackText.textContent = correct
      ? `${question.explanation} Exam clue: ${question.clue}`
      : `${selectedAnswer} does not satisfy the requirement. ${question.clue} Correct answer: ${question.answer}. ${question.explanation}`;

    elements.answerBreakdown.className = "answer-breakdown";
    elements.answerBreakdown.innerHTML = buildAnswerBreakdownHtml(
      question,
      selectedAnswer,
    );
  }

  function handleTimeout() {
    if (state.answered) return;
    state.answered = true;
    const question = state.questions[state.currentIndex];
    elements.answerOptions
      .querySelectorAll(".answer-button")
      .forEach((button) => (button.disabled = true));

    state.answers.push({
      ...question,
      selected: "Time expired",
      correct: false,
      timedOut: true,
    });

    elements.nextQuestionButton.disabled = false;
    showToast("Time expired. Move to the next question.");
  }

  function nextQuestion() {
    if (!state.answered) return;
    state.currentIndex += 1;
    if (state.currentIndex < state.questions.length) displayQuestion();
    else finishSession();
  }

  function saveSessionProgress() {
    progress.questionsAnswered += state.answers.length;
    progress.correctAnswers += state.answers.filter(
      (answer) => answer.correct,
    ).length;

    state.answers.forEach((answer) => {
      const topicData = progress.topicStats[answer.topic];
      topicData.answered += 1;
      if (answer.correct) topicData.correct += 1;

      if (answer.lessonId && progress.lessonStats[answer.lessonId]) {
        progress.lessonStats[answer.lessonId].answered += 1;
        if (answer.correct) progress.lessonStats[answer.lessonId].correct += 1;
      }
    });

    saveProgress();
  }

  function finishSession() {
    clearInterval(state.timerId);
    const accuracy = calculateAccuracy(state.correct, state.questions.length);
    state.lastAccuracy = accuracy;
    saveSessionProgress();

    if (state.fromLesson && state.lessonCheckId && accuracy >= 80) {
      if (!progress.completedLessons.includes(state.lessonCheckId)) {
        progress.completedLessons.push(state.lessonCheckId);
        saveProgress();
        showToast("Lesson mastered and marked complete.");
      }
    }

    updateHomeProgress();
    renderStudyTopicList();
    renderWeakAreas();
    displayResults(accuracy);
    showScreen(
      "results-screen",
      state.fromLesson ? "study-screen" : "practice-screen",
    );
  }

  function displayResults(accuracy) {
    const missed = state.answers.filter((answer) => !answer.correct);

    if (accuracy >= 90) {
      elements.resultsTitle.textContent = "Strong mastery.";
      elements.resultsMessage.textContent =
        "You are recognizing both the concept and the exam clue. Review any miss before moving on.";
    } else if (accuracy >= 80) {
      elements.resultsTitle.textContent = "Passed the mastery check.";
      elements.resultsMessage.textContent =
        "The idea is there. Review the misses until you can explain why every distractor is wrong.";
    } else if (accuracy >= 70) {
      elements.resultsTitle.textContent = "Close, but do another pass.";
      elements.resultsMessage.textContent =
        "You are near the target. Revisit the explanation and retry before calling this area mastered.";
    } else {
      elements.resultsTitle.textContent = "This needs another lesson pass.";
      elements.resultsMessage.textContent =
        "That is useful data. Relearn the weak subtopic, then retry with the exam clue in mind.";
    }

    if (state.fromLesson) {
      elements.resultsMessage.textContent +=
        accuracy >= 80
          ? " This lesson is now marked complete."
          : " Lesson checks require 80% to mark the lesson complete.";
    }

    elements.resultsAccuracy.textContent = `${accuracy}%`;
    elements.resultsCorrect.textContent = `${state.correct} of ${state.questions.length} correct`;
    elements.resultsTopic.textContent =
      TOPIC_NAMES[state.sessionSettings.topic];
    elements.resultsMode.textContent =
      state.sessionSettings.mode === "exam"
        ? "Exam Simulation"
        : state.fromLesson
          ? "Lesson Check"
          : "Practice";

    if (state.fromLesson) {
      elements.studyWeakButton.textContent =
        accuracy >= 80 ? "Next Lesson" : "Review This Lesson";
    } else {
      elements.studyWeakButton.textContent = "Study Weak Areas";
    }

    elements.resultsReviewCount.textContent = missed.length;
    renderMissedReview(missed);
  }

  function renderMissedReview(missed) {
    elements.missedReviewList.innerHTML = "";
    elements.missedReviewList.classList.add("hide");
    elements.missedReviewToggle.setAttribute("aria-expanded", "false");
    elements.reviewToggleIcon.textContent = "+";
    elements.missedReviewLabel.textContent = `${missed.length} ${missed.length === 1 ? "question" : "questions"} to review`;
    elements.missedReviewCard.classList.toggle("hide", missed.length === 0);

    missed.forEach((item, index) => {
      const lesson = LESSONS.find((entry) => entry.id === item.lessonId);
      const card = document.createElement("div");
      card.className = "review-item";
      card.innerHTML = `
        <span>Review ${index + 1} · ${escapeHtml(lesson?.title || TOPIC_NAMES[item.topic])}</span>
        <strong>${escapeHtml(item.question)}</strong>
        <p>Your answer: ${escapeHtml(item.selected)}</p>
        <p><b>Exam clue:</b> ${escapeHtml(item.clue)}</p>
        <p class="review-correct">Correct answer: ${escapeHtml(item.answer)}</p>
        <p>${escapeHtml(item.explanation)}</p>
        ${buildAnswerBreakdownHtml(item, item.timedOut ? null : item.selected)}
      `;
      elements.missedReviewList.appendChild(card);
    });
  }

  function toggleMissedReview() {
    const open =
      elements.missedReviewToggle.getAttribute("aria-expanded") === "true";
    elements.missedReviewToggle.setAttribute("aria-expanded", String(!open));
    elements.missedReviewList.classList.toggle("hide", open);
    elements.reviewToggleIcon.textContent = open ? "+" : "−";
  }

  // ---------------------------------------------------------
  // SIMULATOR LABS
  // ---------------------------------------------------------

  function renderLabs() {
    state.currentLab = null;
    elements.labList.className = "lab-list-shell";

    const completed = progress.completedLabs.length;
    elements.labList.innerHTML = `
      <section class="lab-dashboard">
        <div>
          <span class="section-kicker">Local simulator</span>
          <h2>${completed} of ${LABS.length} labs mastered</h2>
          <p>Every simulator checks your configuration first, then quizzes the decisions you made. Nothing here creates Azure resources or charges.</p>
        </div>
        <div class="lab-dashboard-score">
          <strong>${Math.round((completed / LABS.length) * 100)}%</strong>
          <span>LAB MASTERY</span>
        </div>
      </section>
      <div class="lab-grid">
        ${LABS.map((lab) => {
          const done = progress.completedLabs.includes(lab.id);
          const relatedLessons = (lab.lessonIds || [])
            .map((id) => LESSONS.find((lesson) => lesson.id === id))
            .filter(Boolean);
          return `
            <article class="lab-card ${done ? "mastered" : ""}">
              <div class="lab-card-top">
                <span>${lab.domain}</span>
                <strong>${done ? "Mastered ✓" : lab.duration}</strong>
              </div>
              <h3>${lab.title}</h3>
              <p>${lab.description}</p>
              ${
                relatedLessons.length
                  ? `<p class="lab-related-lessons">Related lesson${relatedLessons.length > 1 ? "s" : ""}: ${relatedLessons.map((l) => escapeHtml(l.title)).join(", ")}</p>`
                  : ""
              }
              <div class="lab-card-footer">
                <span>${lab.fields.length} configuration decisions · ${lab.quiz.length} quiz questions</span>
                <button class="secondary-button" data-lab-action="launch" data-lab="${lab.id}" type="button">
                  ${done ? "Practice Again" : "Launch Simulator"} →
                </button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function launchLab(labId) {
    const lab = LABS.find((item) => item.id === labId);
    if (!lab) return;
    state.currentLab = labId;
    state.labAttempts = 0;
    state.labConfigPassed = false;
    renderLabSimulator();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLabSimulator() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;

    const chromeHtml = lab.nonAzure
      ? `
        <div class="fake-portal-topbar workspace-topbar">
          <div class="fake-azure-mark workspace-mark">W</div>
          <strong>Network Design Workspace</strong>
          <span>Vendor-neutral · no Azure resources</span>
          <b>Simulator</b>
        </div>`
      : `
        <div class="fake-portal-topbar">
          <div class="fake-azure-mark">A</div>
          <strong>Microsoft Azure</strong>
          <span>CloudAdmin Training Tenant</span>
          <b>Simulator</b>
        </div>`;

    const instructionText = lab.nonAzure
      ? "Use only the mission requirements. Real troubleshooting rewards working the problem in order, not guessing."
      : "Use only the mission requirements. AZ-104 often gives extra-looking choices to test whether you can identify the minimum correct configuration.";

    elements.labList.className = "lab-simulator-shell";
    elements.labList.innerHTML = `
      <div class="simulator-toolbar">
        <button class="text-button" data-lab-action="back" type="button">← All labs</button>
        <div>
          <span>${lab.domain}</span>
          <strong>${lab.title}</strong>
        </div>
        <span class="simulator-local-badge">${lab.nonAzure ? "NO AZURE REQUIRED" : "LOCAL SIMULATION"}</span>
      </div>

      <section class="mission-card">
        <span class="section-kicker">${lab.nonAzure ? "Your mission" : "Your admin mission"}</span>
        <h2>${lab.title}</h2>
        <p>${lab.mission}</p>
      </section>

      <section class="fake-portal ${lab.nonAzure ? "workspace-portal" : ""}">
        ${chromeHtml}

        <div class="fake-portal-body">
          <aside class="fake-portal-nav">
            <strong>${lab.nonAzure ? "Decisions" : "Configuration"}</strong>
            <span class="active">Basics</span>
            <span>${lab.nonAzure ? "Reasoning" : "Networking"}</span>
            <span>${lab.nonAzure ? "Checks" : "Security"}</span>
            <span>Review + create</span>
          </aside>

          <div class="fake-portal-content">
            <div class="fake-breadcrumb">Home › ${lab.domain} › ${lab.title}</div>
            <h3>${lab.nonAzure ? "Work the problem" : "Configure the resource"}</h3>
            <p class="portal-instruction">${instructionText}</p>

            <div class="sim-form">
              ${lab.fields
                .map(
                  (field, index) => `
                <label class="sim-field" data-sim-field="${field.id}">
                  <span><b>${index + 1}.</b> ${field.label}</span>
                  <select data-lab-field="${field.id}">
                    <option value="">Choose a setting...</option>
                    ${field.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
                  </select>
                  <small class="field-help">${field.help}</small>
                  <div class="field-feedback"></div>
                </label>
              `,
                )
                .join("")}
            </div>

            <div id="lab-config-result" class="lab-config-result hide"></div>

            <div class="sim-actions">
              <button class="primary-button" data-lab-action="validate" type="button">Review + Create</button>
              <button class="ghost-button" data-lab-action="reset" type="button">Reset</button>
            </div>
          </div>
        </div>
      </section>

      <div id="lab-quiz-area"></div>
    `;
  }

  function validateLabConfiguration() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;
    state.labAttempts += 1;

    let correctCount = 0;
    lab.fields.forEach((field) => {
      const select = elements.labList.querySelector(
        `[data-lab-field="${field.id}"]`,
      );
      const wrapper = elements.labList.querySelector(
        `[data-sim-field="${field.id}"]`,
      );
      const feedback = wrapper.querySelector(".field-feedback");
      const correct = select.value === field.answer;

      wrapper.classList.remove("field-correct", "field-wrong");
      wrapper.classList.add(correct ? "field-correct" : "field-wrong");

      if (correct) {
        correctCount += 1;
        feedback.textContent = "Correct choice.";
      } else {
        feedback.textContent =
          state.labAttempts >= 2
            ? `${field.help} Recommended choice: ${field.answer}.`
            : field.help;
      }
    });

    const result = get("lab-config-result");
    result.classList.remove("hide", "wrong");

    if (correctCount === lab.fields.length) {
      state.labConfigPassed = true;
      result.innerHTML = `
        <strong>Configuration validated ✓</strong>
        <p>${lab.success}</p>
        <span>Now prove you understand why these settings are correct.</span>
      `;
      renderLabQuiz();
      setTimeout(
        () => get("lab-quiz-area")?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else {
      result.classList.add("wrong");
      result.innerHTML = `
        <strong>${correctCount} of ${lab.fields.length} configuration decisions are correct.</strong>
        <p>Use the coaching under the highlighted fields and try Review + Create again.</p>
        <span>${state.labAttempts >= 2 ? "The recommended choices are now shown so you can learn the pattern instead of getting stuck." : "One retry unlocks stronger hints."}</span>
      `;
    }
  }

  function renderLabQuiz() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab || !state.labConfigPassed) return;
    const area = get("lab-quiz-area");

    area.innerHTML = `
      <section class="lab-quiz-card">
        <span class="section-kicker">Lab knowledge check</span>
        <h2>Can you explain what you just configured?</h2>
        <p>All three must be correct to mark this lab mastered. If you miss one, the explanation stays in the app and you can retry immediately.</p>

        <div class="lab-quiz-list">
          ${lab.quiz
            .map(
              (item, index) => `
            <fieldset class="lab-quiz-question">
              <legend><span>${index + 1}</span>${item.question}</legend>
              ${shuffle(item.options)
                .map(
                  (option) => `
                <label>
                  <input type="radio" name="lab-q-${index}" value="${option}" />
                  <span>${option}</span>
                </label>
              `,
                )
                .join("")}
              <div class="lab-quiz-feedback" data-lab-quiz-feedback="${index}"></div>
            </fieldset>
          `,
            )
            .join("")}
        </div>

        <button class="primary-button" data-lab-action="quiz-submit" type="button">
          Grade Lab Quiz →
        </button>
        <div id="lab-quiz-result" class="lab-quiz-result hide"></div>
      </section>
    `;
  }

  function submitLabQuiz() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;

    const selections = lab.quiz.map((_, index) =>
      elements.labList.querySelector(`input[name="lab-q-${index}"]:checked`),
    );

    if (selections.some((input) => !input)) {
      showToast("Answer every lab quiz question first.");
      return;
    }

    let score = 0;
    lab.quiz.forEach((item, index) => {
      const selected = selections[index].value;
      const correct = selected === item.answer;
      if (correct) score += 1;

      const feedback = elements.labList.querySelector(
        `[data-lab-quiz-feedback="${index}"]`,
      );
      feedback.className = `lab-quiz-feedback ${correct ? "correct" : "wrong"}`;
      feedback.innerHTML = correct
        ? `<strong>Correct.</strong> ${item.explanation}`
        : `<strong>Review:</strong> Correct answer: ${item.answer}. ${item.explanation}`;
    });

    const percent = calculateAccuracy(score, lab.quiz.length);
    progress.labScores[lab.id] = Math.max(
      progress.labScores[lab.id] || 0,
      percent,
    );

    const result = get("lab-quiz-result");
    result.classList.remove("hide", "wrong");

    if (score === lab.quiz.length) {
      if (!progress.completedLabs.includes(lab.id)) {
        progress.completedLabs.push(lab.id);
      }
      saveProgress();
      updateHomeProgress();
      result.innerHTML = `
        <strong>Lab mastered — ${percent}% ✓</strong>
        <p>You configured the mock resource correctly and explained the key decisions. This lab now counts toward your readiness score.</p>
        <button class="secondary-button" data-lab-action="back" type="button">Back to Labs</button>
      `;
    } else {
      saveProgress();
      result.classList.add("wrong");
      result.innerHTML = `
        <strong>${score} of ${lab.quiz.length} correct.</strong>
        <p>Review the explanations above, then retry. Lab mastery requires all answers correct so the concept is not left half-learned.</p>
        <button class="secondary-button" data-lab-action="quiz-retry" type="button">Retry Lab Quiz</button>
      `;
    }
  }

  function resetCurrentLab() {
    renderLabSimulator();
  }

  // ---------------------------------------------------------
  // WEAK AREAS
  // ---------------------------------------------------------

  function renderWeakAreas() {
    const weakest = getWeakestTopic();
    const weakestLesson = getWeakestLesson(weakest?.topic || null);

    if (!weakest) {
      elements.weakestTopic.textContent = "Complete a practice session first";
      elements.weakestTopicNote.textContent =
        "Once you answer some questions, your weakest exam area will appear here.";
      elements.practiceWeakAreaButton.disabled = true;
      delete elements.practiceWeakAreaButton.dataset.topic;
    } else {
      elements.weakestTopic.textContent = TOPIC_NAMES[weakest.topic];
      elements.weakestTopicNote.textContent = weakestLesson
        ? `Current weak subtopic: ${weakestLesson.lesson.title} (${weakestLesson.accuracy}% on ${weakestLesson.answered} question${weakestLesson.answered === 1 ? "" : "s"}).`
        : `Current accuracy: ${weakest.accuracy}%. Keep practicing this domain to expose the exact subtopic pattern.`;
      elements.practiceWeakAreaButton.disabled = false;
      elements.practiceWeakAreaButton.dataset.topic = weakest.topic;
    }

    elements.weakAreaList.innerHTML = "";

    EXAM_TOPICS.forEach((topic) => {
      const stats = progress.topicStats[topic];
      const accuracy = getTopicAccuracy(topic);
      const weakLesson = getWeakestLesson(topic);
      const card = document.createElement("article");
      card.className = "weak-area-card";
      card.innerHTML = `
        <div class="weak-area-heading">
          <div>
            <span>${TOPIC_NAMES[topic]}</span>
            <strong>${stats.answered ? `${accuracy}% accuracy` : "Not tested yet"}</strong>
          </div>
          <b>${stats.answered} answered</b>
        </div>
        <div class="weak-progress-track">
          <span style="width:${stats.answered ? accuracy : 0}%"></span>
        </div>
        <p>${
          weakLesson
            ? `Focus lesson: <strong>${weakLesson.lesson.title}</strong> · ${weakLesson.accuracy}%`
            : "Take a few questions in this domain to identify a specific weak subtopic."
        }</p>
        <button class="ghost-button weak-practice-button" data-weak-topic="${topic}" type="button">
          Practice ${TOPIC_NAMES[topic]}
        </button>
      `;
      elements.weakAreaList.appendChild(card);
    });
  }

  // ---------------------------------------------------------
  // CLOUD ENGINEER WORK SIMULATOR (TICKETS)
  // ---------------------------------------------------------

  function renderTicketList() {
    state.currentTicket = null;
    elements.ticketList.className = "ticket-list-shell";

    const completed = progress.completedTickets.length;
    const byDifficulty = TICKET_DIFFICULTIES.map((difficulty) => ({
      difficulty,
      tickets: TICKETS.filter((ticket) => ticket.difficulty === difficulty),
    }));

    elements.ticketList.innerHTML = `
      <section class="lab-dashboard ticket-dashboard">
        <div>
          <span class="section-kicker">Work Simulator</span>
          <h2>${completed} of ${TICKETS.length} tickets worked</h2>
          <p>Each ticket gives you a scenario, known evidence, and a sequence of real decisions — with feedback on every choice, right or wrong. Nothing here is a live Azure environment.</p>
        </div>
        <div class="lab-dashboard-score">
          <strong>${Math.round((completed / TICKETS.length) * 100)}%</strong>
          <span>SIMULATOR PROGRESS</span>
        </div>
      </section>

      ${byDifficulty
        .map(
          (group) => `
            <div class="ticket-difficulty-group">
              <h3 class="ticket-difficulty-heading">${group.difficulty}</h3>
              <div class="lab-grid">
                ${group.tickets
                  .map((ticket) => {
                    const done = progress.completedTickets.includes(ticket.id);
                    return `
                      <article class="lab-card ticket-card ${done ? "mastered" : ""}">
                        <div class="lab-card-top">
                          <span>#${ticket.ticketNumber} · ${ticket.domain}</span>
                          <strong>${done ? "Resolved ✓" : ticket.difficulty}</strong>
                        </div>
                        <h3>${ticket.title}</h3>
                        <p>${ticket.scenario.length > 140 ? ticket.scenario.slice(0, 140) + "…" : ticket.scenario}</p>
                        <div class="lab-card-footer">
                          <span>${ticket.steps.length} decisions · reported by ${ticket.reportedBy}</span>
                          <button class="secondary-button" data-ticket-action="launch" data-ticket="${ticket.id}" type="button">
                            ${done ? "Work It Again" : "Open Ticket"} →
                          </button>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `,
        )
        .join("")}
    `;
  }

  function launchTicket(ticketId) {
    const ticket = TICKETS.find((item) => item.id === ticketId);
    if (!ticket) return;
    state.currentTicket = ticketId;
    state.ticketStepIndex = 0;
    state.ticketStepAnswered = false;
    state.ticketMistakes = 0;
    renderTicketWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTicketWorkspace() {
    const ticket = TICKETS.find((item) => item.id === state.currentTicket);
    if (!ticket) return;

    elements.ticketList.className = "ticket-workspace-shell";
    const atResolution = state.ticketStepIndex >= ticket.steps.length;

    elements.ticketList.innerHTML = `
      <div class="simulator-toolbar">
        <button class="text-button" data-ticket-action="back" type="button">← All tickets</button>
        <div>
          <span>#${ticket.ticketNumber} · ${ticket.domain} · ${ticket.difficulty}</span>
          <strong>${ticket.title}</strong>
        </div>
        <span class="simulator-local-badge">REPORTED BY ${ticket.reportedBy.toUpperCase()}</span>
      </div>

      <section class="mission-card ticket-scenario-card">
        <span class="section-kicker">Scenario</span>
        <p>${escapeHtml(ticket.scenario)}</p>
      </section>

      <section class="ticket-evidence-card">
        <span class="teach-label">Known evidence</span>
        <dl class="ticket-evidence-list">
          ${ticket.evidence
            .map(
              (item) => `
                <div class="ticket-evidence-item">
                  <dt>${escapeHtml(item.label)}</dt>
                  <dd>${escapeHtml(item.value)}</dd>
                </div>`,
            )
            .join("")}
        </dl>
      </section>

      <div class="ticket-progress-track">
        ${ticket.steps
          .map(
            (_, i) => `<span class="ticket-progress-dot ${i < state.ticketStepIndex ? "done" : i === state.ticketStepIndex ? "current" : ""}"></span>`,
          )
          .join("")}
      </div>

      <div id="ticket-step-area"></div>
    `;

    if (atResolution) {
      renderTicketResolution(ticket);
    } else {
      renderTicketStep(ticket);
    }
  }

  function renderTicketStep(ticket) {
    const area = get("ticket-step-area");
    const step = ticket.steps[state.ticketStepIndex];

    area.innerHTML = `
      <section class="ticket-step-card">
        <span class="section-kicker">Decision ${state.ticketStepIndex + 1} of ${ticket.steps.length}</span>
        <h2>${escapeHtml(step.prompt)}</h2>
        <div class="ticket-step-options">
          ${step.options
            .map(
              (option, i) => `
                <button type="button" class="ticket-option" data-ticket-option="${i}">
                  ${escapeHtml(option.label)}
                </button>`,
            )
            .join("")}
        </div>
        <div id="ticket-step-feedback" class="ticket-step-feedback hide"></div>
        <button id="ticket-continue-button" class="primary-button hide" type="button">Continue →</button>
      </section>
    `;

    area.querySelectorAll(".ticket-option").forEach((button) => {
      button.addEventListener("click", () => answerTicketStep(ticket, Number(button.dataset.ticketOption), button));
    });

    get("ticket-continue-button").addEventListener("click", () => {
      state.ticketStepIndex += 1;
      state.ticketStepAnswered = false;
      renderTicketWorkspace();
    });
  }

  function answerTicketStep(ticket, optionIndex, selectedButton) {
    if (state.ticketStepAnswered) return;
    state.ticketStepAnswered = true;

    const step = ticket.steps[state.ticketStepIndex];
    const option = step.options[optionIndex];
    if (!option.correct) state.ticketMistakes += 1;

    const area = get("ticket-step-area");
    area.querySelectorAll(".ticket-option").forEach((button, i) => {
      button.disabled = true;
      if (step.options[i].correct) button.classList.add("correct");
      else if (button === selectedButton) button.classList.add("wrong");
      else button.classList.add("dimmed");
    });

    const feedback = get("ticket-step-feedback");
    feedback.classList.remove("hide", "wrong");
    if (!option.correct) feedback.classList.add("wrong");
    feedback.innerHTML = `<strong>${option.correct ? "Good call." : "Not the best move."}</strong> ${escapeHtml(option.feedback)}`;

    get("ticket-continue-button").classList.remove("hide");
  }

  function renderTicketResolution(ticket) {
    const area = get("ticket-step-area");
    const alreadyDone = progress.completedTickets.includes(ticket.id);

    if (!alreadyDone) {
      progress.completedTickets.push(ticket.id);
      saveProgress();
    }

    area.innerHTML = `
      <section class="ticket-resolution-card">
        <span class="section-kicker">Resolution</span>
        <h2>Ticket resolved${state.ticketMistakes === 0 ? " — clean run" : ""}</h2>
        <p>${escapeHtml(ticket.resolution.summary)}</p>

        <div class="ticket-resolution-block">
          <span class="teach-label">Why the other options were wrong</span>
          <ul>${ticket.resolution.whyOthersWrong.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>

        <div class="ticket-resolution-block">
          <span class="teach-label">Skills this ticket practiced</span>
          <div class="ticket-skills-list">
            ${ticket.resolution.skillsInvolved.map((skill) => `<span class="ticket-skill-chip">${escapeHtml(skill)}</span>`).join("")}
          </div>
        </div>

        <p class="ticket-journal-hint">Learned something worth remembering here? Log it in the <strong>Cloud Engineer Journal</strong> before moving on.</p>

        <div class="results-actions">
          <button class="primary-button" data-ticket-action="retry" type="button">Work It Again</button>
          <button class="ghost-button" data-ticket-action="back" type="button">Back to All Tickets</button>
        </div>
      </section>
    `;
  }

  // ---------------------------------------------------------
  // CLOUD ENGINEER JOURNAL
  // ---------------------------------------------------------

  function loadJournalEntries() {
    try {
      const raw = localStorage.getItem(JOURNAL_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("CloudAdmin Prep could not load journal entries.", error);
      return [];
    }
  }

  function saveJournalEntries(entries) {
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn("CloudAdmin Prep could not save journal entries.", error);
    }
  }

  function journalEntryMarkdown(entry) {
    return [
      `### ${entry.title}`,
      "",
      `**Problem:** ${entry.problem}`,
      `**Environment:** ${entry.environment}`,
      `**Action:** ${entry.action}`,
      `**Validation:** ${entry.validation}`,
      `**Lessons learned:** ${entry.lessons}`,
    ].join("\n");
  }

  function renderJournal() {
    const entries = loadJournalEntries();
    if (!entries.length) {
      elements.journalEntryList.innerHTML = `
        <p class="journal-empty-state">No journal entries yet. Finish a lab or a Work Simulator ticket, then capture what you did above — this is the raw material for interview stories and a portfolio.</p>
      `;
      return;
    }

    elements.journalEntryList.innerHTML = entries
      .slice()
      .reverse()
      .map(
        (entry) => `
          <article class="journal-entry-card" data-journal-id="${entry.id}">
            <div class="journal-entry-heading">
              <div>
                <span>${new Date(entry.date).toLocaleDateString()}</span>
                <strong>${escapeHtml(entry.title)}</strong>
              </div>
              <div class="journal-entry-actions">
                <button class="ghost-button" data-journal-action="copy" type="button">Copy as Markdown</button>
                <button class="text-button" data-journal-action="delete" type="button">Delete</button>
              </div>
            </div>
            <dl class="journal-entry-body">
              <dt>Problem</dt><dd>${escapeHtml(entry.problem)}</dd>
              <dt>Environment</dt><dd>${escapeHtml(entry.environment)}</dd>
              <dt>Action</dt><dd>${escapeHtml(entry.action)}</dd>
              <dt>Validation</dt><dd>${escapeHtml(entry.validation)}</dd>
              <dt>Lessons learned</dt><dd>${escapeHtml(entry.lessons)}</dd>
            </dl>
          </article>
        `,
      )
      .join("");
  }

  // ---------------------------------------------------------
  // NAVIGATION AND EVENT WIRING
  // ---------------------------------------------------------

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.screen === "labs-screen") renderLabs();
      if (button.dataset.screen === "weak-screen") renderWeakAreas();
      if (button.dataset.screen === "simulator-screen") renderTicketList();
      if (button.dataset.screen === "journal-screen") renderJournal();
      showScreen(button.dataset.screen);
    });
  });

  elements.brandButton.addEventListener("click", () => {
    updateHomeProgress();
    showScreen("home-screen");
  });

  elements.pathCards.forEach((card) => {
    card.addEventListener("click", () => {
      const action = card.dataset.action;
      if (action === "foundations") openStudy("foundation-hierarchy");
      if (action === "az104-study") openStudy("identity-users-groups");
      if (action === "practice") showScreen("practice-screen");
      if (action === "exam") {
        state.practiceSettings = { topic: "mixed", mode: "exam", count: 50 };
        syncPracticeButtons();
        showScreen("practice-screen");
      }
      if (action === "labs") {
        renderLabs();
        showScreen("labs-screen");
      }
      if (action === "weak") {
        renderWeakAreas();
        showScreen("weak-screen");
      }
      if (action === "netfund") openStudy("netfund-what-is-a-network");
      if (action === "automation") openStudy("automation-powershell-fundamentals");
      if (action === "simulator") {
        renderTicketList();
        showScreen("simulator-screen");
      }
    });
  });

  elements.continueLearningButton.addEventListener("click", () => {
    openStudy(getRecommendedLesson().id);
  });

  elements.quickPracticeButton.addEventListener("click", () => {
    state.practiceSettings = { topic: "mixed", mode: "practice", count: 10 };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  elements.previousLessonButton.addEventListener("click", () => {
    const index = LESSONS.findIndex(
      (lesson) => lesson.id === state.currentStudyLesson,
    );
    if (index > 0) selectStudyLesson(LESSONS[index - 1].id);
  });

  elements.lessonCheckButton.addEventListener("click", () => {
    startPractice(true, state.currentStudyLesson);
  });

  elements.lessonRelatedLab.addEventListener("click", (event) => {
    const button = event.target.closest("[data-related-lab]");
    if (!button) return;
    renderLabs();
    showScreen("labs-screen");
    launchLab(button.dataset.relatedLab);
  });

  elements.practiceTopicOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".selection-card");
    if (!button) return;
    state.practiceSettings.topic = button.dataset.topic;
    syncPracticeButtons();
  });

  elements.practiceModeOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".mode-option");
    if (!button) return;
    state.practiceSettings.mode = button.dataset.mode;
    syncPracticeButtons();
  });

  elements.questionCountOptions.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    state.practiceSettings.count = Number(button.dataset.count);
    syncPracticeButtons();
  });

  elements.startPracticeButton.addEventListener("click", () => startPractice());

  elements.answerOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".answer-button");
    if (!button || button.disabled) return;
    answerQuestion(button.dataset.answer, button);
  });

  elements.nextQuestionButton.addEventListener("click", nextQuestion);

  elements.quitQuizButton.addEventListener("click", () => {
    clearInterval(state.timerId);
    showScreen(state.fromLesson ? "study-screen" : "practice-screen");
  });

  elements.missedReviewToggle.addEventListener("click", toggleMissedReview);

  elements.practiceAgainButton.addEventListener("click", () => {
    if (state.fromLesson && state.lessonCheckId) {
      startPractice(true, state.lessonCheckId);
    } else {
      startPractice();
    }
  });

  elements.studyWeakButton.addEventListener("click", () => {
    if (state.fromLesson && state.lessonCheckId) {
      const currentIndex = LESSONS.findIndex(
        (lesson) => lesson.id === state.lessonCheckId,
      );

      if (state.lastAccuracy >= 80 && currentIndex < LESSONS.length - 1) {
        openStudy(LESSONS[currentIndex + 1].id);
      } else if (state.lastAccuracy < 80) {
        openStudy(state.lessonCheckId);
      } else {
        const weakAfterCourse = getWeakestLesson();
        openStudy(weakAfterCourse?.lesson.id || getRecommendedLesson().id);
      }
      return;
    }

    const weak = getWeakestLesson();
    if (weak) openStudy(weak.lesson.id);
    else openStudy(getRecommendedLesson().id);
  });

  elements.resultsHomeButton.addEventListener("click", () => {
    updateHomeProgress();
    showScreen("home-screen");
  });

  elements.labList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lab-action]");
    if (!button) return;
    const action = button.dataset.labAction;
    if (action === "launch") launchLab(button.dataset.lab);
    if (action === "back") renderLabs();
    if (action === "validate") validateLabConfiguration();
    if (action === "reset") resetCurrentLab();
    if (action === "quiz-submit") submitLabQuiz();
    if (action === "quiz-retry") renderLabQuiz();
  });

  elements.practiceWeakAreaButton.addEventListener("click", () => {
    const topic = elements.practiceWeakAreaButton.dataset.topic;
    if (!topic) return;
    state.practiceSettings = { topic, mode: "practice", count: 10 };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  elements.weakAreaList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-weak-topic]");
    if (!button) return;
    state.practiceSettings = {
      topic: button.dataset.weakTopic,
      mode: "practice",
      count: 10,
    };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  elements.ticketList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ticket-action]");
    if (!button) return;
    const action = button.dataset.ticketAction;
    if (action === "launch") launchTicket(button.dataset.ticket);
    if (action === "back") renderTicketList();
    if (action === "retry") launchTicket(state.currentTicket);
  });

  elements.journalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = {
      id: `journal-${Date.now()}`,
      date: new Date().toISOString(),
      title: elements.journalTitle.value.trim(),
      problem: elements.journalProblem.value.trim(),
      environment: elements.journalEnvironment.value.trim(),
      action: elements.journalAction.value.trim(),
      validation: elements.journalValidation.value.trim(),
      lessons: elements.journalLessons.value.trim(),
    };
    if (!entry.title) return;

    const entries = loadJournalEntries();
    entries.push(entry);
    saveJournalEntries(entries);
    elements.journalForm.reset();
    renderJournal();
    showToast("Journal entry saved.");
  });

  elements.journalEntryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-journal-action]");
    if (!button) return;
    const card = button.closest("[data-journal-id]");
    const id = card?.dataset.journalId;
    const entries = loadJournalEntries();
    const entry = entries.find((item) => item.id === id);
    if (!entry) return;

    if (button.dataset.journalAction === "copy") {
      const markdown = journalEntryMarkdown(entry);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(markdown)
          .then(() => showToast("Copied entry as Markdown."))
          .catch(() => showToast("Could not copy — your browser may block clipboard access."));
      } else {
        showToast("Clipboard access isn't available in this browser.");
      }
    }

    if (button.dataset.journalAction === "delete") {
      saveJournalEntries(entries.filter((item) => item.id !== id));
      renderJournal();
      showToast("Journal entry deleted.");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (get("quiz-screen").classList.contains("hide")) return;
    if (!state.answered && ["1", "2", "3", "4"].includes(event.key)) {
      const button =
        elements.answerOptions.querySelectorAll(".answer-button")[
          Number(event.key) - 1
        ];
      if (button && !button.disabled) button.click();
    }
    if (
      state.answered &&
      event.key === "Enter" &&
      !elements.nextQuestionButton.disabled
    ) {
      elements.nextQuestionButton.click();
    }
  });

  updateHomeProgress();
  renderStudyTopicList();
  renderLesson();
  syncPracticeButtons();
  renderLabs();
  renderWeakAreas();
  renderTicketList();
  renderJournal();
  showScreen("home-screen");

  console.log(
    `CloudAdmin Prep v4.0 initialized: ${LESSONS.length} lessons, ${QUESTIONS.length} questions, ${LABS.length} simulator labs, ${TICKETS.length} work-simulator tickets.`,
  );
});
