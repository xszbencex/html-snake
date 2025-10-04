import { EventEmitter } from '../event-emitter.class';

export abstract class BaseOverlay extends EventEmitter {
  get container(): HTMLDivElement {
    return document.getElementById(this.containerId) as HTMLDivElement;
  }

  private containerId: string;
  private isActivated = false;
  private eventListenersAbortController!: AbortController;

  get abortSignal(): AbortSignal {
    return this.eventListenersAbortController.signal;
  }

  constructor(containerId: string) {
    super();
    this.containerId = containerId;
  }

  activate() {
    if (!this.isActivated) {
      this.eventListenersAbortController = new AbortController();
      this.container.classList.add('active');
      this.listenOnEvents();
      this.isActivated = true;
    }
  }

  deactivate() {
    if (this.isActivated) {
      this.eventListenersAbortController.abort();
      this.container.classList.remove('active');
      this.isActivated = false;
    }
  }

  protected abstract listenOnEvents(): void;
}
