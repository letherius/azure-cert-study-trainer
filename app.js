/* =========================================================
   CLOUDADMIN PREP — APPLICATION LOGIC
   Pure application logic: rendering, navigation, progress
   tracking, and event wiring. Curriculum content lives in
   data/meta.js, data/lessons.js, data/questions.js, and
   data/labs.js, loaded before this file (see index.html) and
   exposed as the globals LESSONS, QUESTIONS, LABS,
   TOPIC_NAMES, EXAM_TOPICS, EXAM_WEIGHTS, EXAM_LEVELS.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("CloudAdmin Prep v3.0 loaded.");

  const STORAGE_KEY = "cloudAdminPrepV2";
  const LEGACY_KEY = "cloudAdminPrepV1";

  const emptyTopicStats = () =>
    Object.fromEntries(
      ["foundations", ...EXAM_TOPICS].map((topic) => [
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
    lastStudyLesson: "foundation-hierarchy",
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
      return QUESTIONS.filter((question) => question.topic !== "foundations");
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
    const lessonPart = (progress.completedLessons.length / LESSONS.length) * 30;
    const labPart = (progress.completedLabs.length / LABS.length) * 25;
    const volumePart = (Math.min(progress.questionsAnswered, 120) / 120) * 20;
    const accuracy = calculateAccuracy(
      progress.correctAnswers,
      progress.questionsAnswered,
    );
    const accuracyPart =
      progress.questionsAnswered >= 10 ? (accuracy / 100) * 25 : 0;
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
    const accuracy = calculateAccuracy(
      progress.correctAnswers,
      progress.questionsAnswered,
    );
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

    elements.questionsAnswered.textContent = progress.questionsAnswered;
    elements.overallAccuracy.textContent = `${accuracy}%`;
    elements.topicsCompleted.textContent = `${progress.completedLessons.length} / ${LESSONS.length}`;

    const recommended = getRecommendedLesson();
    elements.recommendedTopic.textContent = recommended.title;
    elements.recommendedNote.textContent =
      progress.completedLessons.length === LESSONS.length
        ? "All lessons are complete. Keep drilling weak subtopics and simulator labs. Readiness is a study-progress indicator, not a guaranteed exam score."
        : recommended.summary;

    elements.identityProgress.style.width = `${getDomainMastery("identity")}%`;
    elements.storageProgress.style.width = `${getDomainMastery("storage")}%`;
    elements.computeProgress.style.width = `${getDomainMastery("compute")}%`;
    elements.networkingProgress.style.width = `${getDomainMastery("networking")}%`;
    elements.monitoringProgress.style.width = `${getDomainMastery("monitoring")}%`;
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
      ${renderPortalWalkthrough(lesson.portalSteps)}
      ${renderCommandBlock("Azure CLI", lesson.cli)}
      ${renderCommandBlock("Azure PowerShell", lesson.powershell)}
      ${renderListCard("exam-trap-card", "Common mistakes", lesson.commonMistakes)}
      <div class="exam-trap-card">
        <span class="teach-label">Common exam traps</span>
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
      const lesson = LESSONS.find((item) => item.id === lessonId);
      const direct = shuffle(
        QUESTIONS.filter((item) => item.lessonId === lessonId),
      );
      const fill = shuffle(
        QUESTIONS.filter(
          (item) => item.topic === lesson.topic && item.lessonId !== lessonId,
        ),
      );
      pool = [...direct, ...fill].slice(0, 5);
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

    elements.labList.className = "lab-simulator-shell";
    elements.labList.innerHTML = `
      <div class="simulator-toolbar">
        <button class="text-button" data-lab-action="back" type="button">← All labs</button>
        <div>
          <span>${lab.domain}</span>
          <strong>${lab.title}</strong>
        </div>
        <span class="simulator-local-badge">LOCAL SIMULATION</span>
      </div>

      <section class="mission-card">
        <span class="section-kicker">Your admin mission</span>
        <h2>${lab.title}</h2>
        <p>${lab.mission}</p>
      </section>

      <section class="fake-portal">
        <div class="fake-portal-topbar">
          <div class="fake-azure-mark">A</div>
          <strong>Microsoft Azure</strong>
          <span>CloudAdmin Training Tenant</span>
          <b>Simulator</b>
        </div>

        <div class="fake-portal-body">
          <aside class="fake-portal-nav">
            <strong>Configuration</strong>
            <span class="active">Basics</span>
            <span>Networking</span>
            <span>Security</span>
            <span>Review + create</span>
          </aside>

          <div class="fake-portal-content">
            <div class="fake-breadcrumb">Home › ${lab.domain} › ${lab.title}</div>
            <h3>Configure the resource</h3>
            <p class="portal-instruction">Use only the mission requirements. AZ-104 often gives extra-looking choices to test whether you can identify the minimum correct configuration.</p>

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
  // NAVIGATION AND EVENT WIRING
  // ---------------------------------------------------------

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.screen === "labs-screen") renderLabs();
      if (button.dataset.screen === "weak-screen") renderWeakAreas();
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
  showScreen("home-screen");

  console.log(
    `CloudAdmin Prep v3.0 initialized: ${LESSONS.length} lessons, ${QUESTIONS.length} questions, ${LABS.length} simulator labs.`,
  );
});
