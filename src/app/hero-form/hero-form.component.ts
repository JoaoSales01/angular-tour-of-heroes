import { Component, EventEmitter,Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hero, HeroUniverse } from '../hero';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css']
})
export class HeroFormComponent implements OnInit {

  @Input() hero!:Hero;

  @Output ()heroSaved:EventEmitter<void>=new EventEmitter<void>();

  @Output ()goBack:EventEmitter<void>=new EventEmitter<void>();

  heroUniverses: Array<HeroUniverse> = [HeroUniverse.DC, HeroUniverse.MARVEL];

  formGroup!: FormGroup

  regUrl: string = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";

  constructor( 
    private heroService: HeroService,
    private formBuilder: FormBuilder) {
    
   }

  ngOnInit(): void {
    this.formGroup= this.formBuilder.group({
      name: [this.hero.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      id: [this.hero.id],
      description: [this.hero.description, [Validators.minLength(3)]],
      
      imageUrl: [this.hero.imageUrl, [Validators.required, Validators.pattern(this.regUrl)]],
      universe: [this.hero.universe],
    });
  }


  onGoBack(): void {
    this.goBack.emit();
  }

  save(): void {
    let hero: Hero = this.formGroup.value
    if (hero.id) {
      this.heroService.updateHero(hero)
      .subscribe(() => this.heroSaved.emit());
    }else{
      this.heroService.addHero(hero)
      .subscribe(() => this.heroSaved.emit());
    }
    
  }

}
