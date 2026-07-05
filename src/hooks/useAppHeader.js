import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';

export const HEADER_INTRO_KEY = 'lims-header-intro';
const TRANSITION_MS = 300;
const INTRO_VISIBLE_MS = 400;
const ARM_IDLE_MS = 200;
const WHEEL_REVEAL_DELTA = -8;
const WHEEL_HIDE_DELTA = 8;
const TOUCH_REVEAL_DELTA = 24;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function isAtTop(element) {
  return element.scrollTop <= 0;
}

/**
 * Controls authenticated workspace header visibility (fully visible / fully hidden).
 * Reveal at scroll top requires two gestures: reach top + release, then scroll up again.
 */
export function useAppHeader({ enabled, headerRef, mainRef, shellRef }) {
  const [headerVisible, setHeaderVisible] = useState(() => {
    if (!enabled) {
      return true;
    }
    return sessionStorage.getItem(HEADER_INTRO_KEY) === '1';
  });

  const animatingRef = useRef(false);
  const headerVisibleRef = useRef(headerVisible);
  const lastScrollTopRef = useRef(0);
  const touchStartYRef = useRef(0);
  const armedAtTopRef = useRef(false);
  const wheelIdleTimerRef = useRef(null);

  headerVisibleRef.current = headerVisible;

  const clearWheelIdle = useCallback(() => {
    if (wheelIdleTimerRef.current !== null) {
      window.clearTimeout(wheelIdleTimerRef.current);
      wheelIdleTimerRef.current = null;
    }
  }, []);

  const disarmReveal = useCallback(() => {
    armedAtTopRef.current = false;
    clearWheelIdle();
  }, [clearWheelIdle]);

  const scheduleArmAtTop = useCallback(
    (main) => {
      clearWheelIdle();
      wheelIdleTimerRef.current = window.setTimeout(() => {
        wheelIdleTimerRef.current = null;
        if (main && isAtTop(main) && !headerVisibleRef.current) {
          armedAtTopRef.current = true;
        }
      }, ARM_IDLE_MS);
    },
    [clearWheelIdle]
  );

  const armAtTopNow = useCallback((main) => {
    if (main && isAtTop(main) && !headerVisibleRef.current) {
      armedAtTopRef.current = true;
    }
  }, []);

  const updateMeasuredHeight = useCallback(() => {
    const header = headerRef.current;
    const shell = shellRef.current;
    if (!header || !shell) {
      return;
    }

    const inner = header.firstElementChild;
    const height = inner
      ? Math.ceil(inner.getBoundingClientRect().height)
      : Math.ceil(header.scrollHeight);

    shell.style.setProperty('--lims-header-measured-height', `${Math.max(height, 1)}px`);
  }, [headerRef, shellRef]);

  const beginTransition = useCallback(() => {
    if (prefersReducedMotion()) {
      return;
    }
    animatingRef.current = true;
    window.setTimeout(() => {
      animatingRef.current = false;
    }, TRANSITION_MS + 50);
  }, []);

  const hideHeader = useCallback(() => {
    if (!enabled || !headerVisibleRef.current) {
      return;
    }
    beginTransition();
    disarmReveal();
    setHeaderVisible(false);
  }, [enabled, beginTransition, disarmReveal]);

  const showHeader = useCallback(() => {
    if (!enabled || headerVisibleRef.current) {
      return;
    }
    beginTransition();
    disarmReveal();
    setHeaderVisible(true);
  }, [enabled, beginTransition, disarmReveal]);

  useLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    updateMeasuredHeight();

    const hasIntro = sessionStorage.getItem(HEADER_INTRO_KEY) === '1';
    if (!hasIntro) {
      setHeaderVisible(false);
      return undefined;
    }

    setHeaderVisible(true);

    const introTimer = window.setTimeout(() => {
      sessionStorage.removeItem(HEADER_INTRO_KEY);
      hideHeader();
    }, prefersReducedMotion() ? 0 : INTRO_VISIBLE_MS);

    return () => window.clearTimeout(introTimer);
  }, [enabled, hideHeader, updateMeasuredHeight]);

  useEffect(() => {
    const header = headerRef.current;
    const shell = shellRef.current;
    if (!enabled || !header || !shell) {
      return undefined;
    }

    updateMeasuredHeight();

    const resizeObserver = new ResizeObserver(updateMeasuredHeight);
    resizeObserver.observe(header);
    if (header.firstElementChild) {
      resizeObserver.observe(header.firstElementChild);
    }

    const onTransitionEnd = (event) => {
      if (event.propertyName === 'max-height') {
        animatingRef.current = false;
      }
    };

    header.addEventListener('transitionend', onTransitionEnd);
    window.addEventListener('resize', updateMeasuredHeight);

    return () => {
      resizeObserver.disconnect();
      header.removeEventListener('transitionend', onTransitionEnd);
      window.removeEventListener('resize', updateMeasuredHeight);
    };
  }, [enabled, headerRef, shellRef, updateMeasuredHeight]);

  useEffect(() => {
    const main = mainRef.current;
    if (!enabled || !main) {
      return undefined;
    }

    const onScroll = () => {
      if (animatingRef.current) {
        lastScrollTopRef.current = main.scrollTop;
        return;
      }

      const scrollTop = main.scrollTop;
      const delta = scrollTop - lastScrollTopRef.current;

      if (scrollTop > 0) {
        disarmReveal();
      }

      if (headerVisibleRef.current && delta > 2) {
        hideHeader();
      }

      lastScrollTopRef.current = scrollTop;
    };

    const onWheel = (event) => {
      if (animatingRef.current) {
        return;
      }

      if (main.scrollTop > 0) {
        disarmReveal();
        return;
      }

      if (headerVisibleRef.current) {
        if (event.deltaY > WHEEL_HIDE_DELTA) {
          hideHeader();
        }
        return;
      }

      if (event.deltaY < WHEEL_REVEAL_DELTA && armedAtTopRef.current) {
        showHeader();
        return;
      }

      scheduleArmAtTop(main);
    };

    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
      if (main.scrollTop > 0) {
        disarmReveal();
      }
    };

    const onTouchMove = (event) => {
      if (animatingRef.current || headerVisibleRef.current) {
        return;
      }
      if (main.scrollTop > 0) {
        disarmReveal();
        return;
      }

      const currentY = event.touches[0]?.clientY ?? 0;
      if (
        armedAtTopRef.current &&
        currentY - touchStartYRef.current > TOUCH_REVEAL_DELTA
      ) {
        showHeader();
      }
    };

    const onTouchEnd = () => {
      if (animatingRef.current || headerVisibleRef.current) {
        return;
      }
      armAtTopNow(main);
    };

    const onKeyDown = (event) => {
      if (animatingRef.current) {
        return;
      }

      if (headerVisibleRef.current) {
        if (
          isAtTop(main) &&
          (event.key === 'ArrowDown' || event.key === 'PageDown')
        ) {
          hideHeader();
        }
        return;
      }

      if (!isAtTop(main)) {
        disarmReveal();
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        if (armedAtTopRef.current) {
          showHeader();
        } else {
          armedAtTopRef.current = true;
        }
      }
    };

    main.addEventListener('scroll', onScroll, { passive: true });
    main.addEventListener('wheel', onWheel, { passive: true });
    main.addEventListener('touchstart', onTouchStart, { passive: true });
    main.addEventListener('touchmove', onTouchMove, { passive: true });
    main.addEventListener('touchend', onTouchEnd, { passive: true });
    main.addEventListener('touchcancel', onTouchEnd, { passive: true });
    main.addEventListener('keydown', onKeyDown);

    return () => {
      clearWheelIdle();
      main.removeEventListener('scroll', onScroll);
      main.removeEventListener('wheel', onWheel);
      main.removeEventListener('touchstart', onTouchStart);
      main.removeEventListener('touchmove', onTouchMove);
      main.removeEventListener('touchend', onTouchEnd);
      main.removeEventListener('touchcancel', onTouchEnd);
      main.removeEventListener('keydown', onKeyDown);
    };
  }, [
    enabled,
    mainRef,
    hideHeader,
    showHeader,
    disarmReveal,
    scheduleArmAtTop,
    armAtTopNow,
    clearWheelIdle,
  ]);

  useEffect(() => {
    if (headerVisible) {
      updateMeasuredHeight();
    }
  }, [headerVisible, updateMeasuredHeight]);

  return {
    headerVisible,
    hideHeader,
    showHeader,
  };
}
