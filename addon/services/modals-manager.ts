import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { isArray } from '@ember/array';
import RSVP, { defer } from 'rsvp';

export declare type EbmmPromiseFactory = () => RSVP.Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export declare type EbmmConfirmPayload = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export declare type EbmmDeclinePayload = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export declare interface EbmmModalOptions {
  title?: string;
  titleComponent?: string;
  body?: string;
  bodyComponent?: string;
  footer?: string;
  footerComponent?: string;
  confirm?: string;
  decline?: string;
  cancel?: string;
  promptValue?: string;
  process?: EbmmPromiseFactory;
  promises?: EbmmPromiseFactory[];
  settled?: boolean;
  disallowEmpty?: boolean;
  modalClass?: string;
  backdrop?: boolean;
  backdropClose?: boolean;
  fade?: boolean;
  keyboard?: boolean;
  position?: 'top' | 'center';
  scrollable?: boolean;
  size?: 'lg' | 'sm' | null;
  backdropTransitionDuration?: number;
  renderInPlace?: boolean;
  transitionDuration?: number;
  confirmIsActive?: boolean;
  confirmButtonSize?: string;
  confirmButtonType?: string;
  confirmIconActive?: string;
  confirmIconInactive?: string;
  declineIsActive?: boolean;
  declineButtonSize?: string;
  declineButtonType?: string;
  declineIconActive?: string;
  declineIconInactive?: string;
}

export default class ModalsManager<T> extends Service {
  @tracked
  modalIsOpened = false;

  @tracked
  modalsContainerPath = 'ebmm-modals-container';

  @tracked
  modalDefer: RSVP.Deferred<T> | null = null;

  defaultOptions: EbmmModalOptions = {
    title: ' ',
    body: ' ',
    footer: ' ',
    confirm: 'Yes',
    decline: 'No',
    cancel: 'Cancel',
    backdrop: true,
    backdropClose: true,
    backdropTransitionDuration: 150,
    fade: true,
    keyboard: true,
    position: 'top',
    renderInPlace: false,
    scrollable: false,
    size: null,
    transitionDuration: 300,
    confirmIsActive: false,
    confirmButtonSize: 'md',
    confirmButtonType: 'primary',
    confirmIconActive: '',
    confirmIconInactive: '',
    declineIsActive: false,
    declineButtonSize: 'md',
    declineButtonType: 'secondary',
    declineIconActive: '',
    declineIconInactive: '',
    modalClass: '',
  };

  @tracked
  options: EbmmModalOptions = {} as EbmmModalOptions;

  @tracked
  componentToRender: string | unknown | null = null;

  /**
   * Shows custom modal
   *
   * @method show
   * @param {string} componentName component's name with custom modal
   * @param {object} options
   * @return {RSVP.Promise}
   */
  show(componentToRender: string, options: EbmmModalOptions): RSVP.Promise<T> {
    assert(
      'Only one modal may be opened in the same time!',
      !this.modalIsOpened
    );
    const opts = Object.assign({}, this.defaultOptions, options);
    this.componentToRender = componentToRender;
    this.modalIsOpened = true;
    this.options = opts;
    const modalDefer = defer<T>();
    this.modalDefer = modalDefer;
    return modalDefer.promise;
  }

  /**
   * Shows `alert`-modal
   *
   * @method alert
   * @param {object} options
   * @return {RSVP.Promise}
   */
  alert(options: EbmmModalOptions): RSVP.Promise<T> {
    return this.show(`${this.modalsContainerPath}/alert`, options);
  }

  /**
   * Shows `confirm`-modal
   *
   * @method confirm
   * @param {object} options
   * @return {RSVP.Promise}
   */
  confirm(options: EbmmModalOptions): RSVP.Promise<T> {
    return this.show(`${this.modalsContainerPath}/confirm`, options);
  }

  /**
   * Shows `prompt`-modal
   *
   * @method prompt
   * @param {object} options
   * @return {RSVP.Promise}
   */
  prompt(options: EbmmModalOptions): RSVP.Promise<T> {
    return this.show(`${this.modalsContainerPath}/prompt`, options);
  }

  /**
   * Shows `prompt-confirm`-modal
   *
   * @method promptConfirm
   * @param {object} options
   * @return {RSVP.Promise}
   */
  promptConfirm(options: EbmmModalOptions): RSVP.Promise<T> {
    assert(
      '"options.promptValue" must be defined and not empty',
      !!options.promptValue
    );
    return this.show(`${this.modalsContainerPath}/prompt-confirm`, options);
  }

  /**
   * Show `check-confirm`-modal
   *
   * @method checkConfirm
   * @param {object} options
   * @return {RSVP.Promise}
   */
  checkConfirm(options: EbmmModalOptions): RSVP.Promise<T> {
    return this.show(`${this.modalsContainerPath}/check-confirm`, options);
  }

  /**
   * Shows `progress`-modal
   *
   * @method progress
   * @param {object} options
   * @return {RSVP.Promise}
   */
  progress(options: EbmmModalOptions): RSVP.Promise<T> {
    assert(
      '`options.promises` must be an array',
      options && isArray(options.promises)
    );
    return this.show(`${this.modalsContainerPath}/progress`, options);
  }

  /**
   * Shows `process`-modal
   *
   * @method process
   * @param {object} options
   * @return {RSVP.Promise}
   */
  process(options: EbmmModalOptions): RSVP.Promise<T> {
    assert('`options.process` must be defined', options && options.process);
    return this.show(`${this.modalsContainerPath}/process`, options);
  }

  onConfirmClick(v: EbmmConfirmPayload): void {
    this.modalIsOpened = false;
    this.modalDefer && this.modalDefer.resolve(v);
    this.clearOptions();
  }

  onDeclineClick(v: EbmmDeclinePayload): void {
    this.modalIsOpened = false;
    this.modalDefer && this.modalDefer.reject(v);
    this.clearOptions();
  }

  protected clearOptions(): void {
    this.options = {} as EbmmModalOptions;
  }
}
