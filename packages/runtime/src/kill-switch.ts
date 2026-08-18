export class KillSwitch {
  private active = false;
  engage(): void { this.active = true; }
  release(): void { this.active = false; }
  isEngaged(): boolean { return this.active; }
  assertOperational(): void { if (this.active) throw new Error('GLOBAL_KILL_SWITCH_ENGAGED'); }
}