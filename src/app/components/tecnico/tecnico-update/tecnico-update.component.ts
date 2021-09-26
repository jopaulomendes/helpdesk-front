import { ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Tecnico } from 'src/app/models/tecnico';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(4));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(4));

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      resposta.perfis = [];
      this.tecnico = resposta;
    });
  }

  update(): void {
    this.service.update(this.tecnico).subscribe(() => {
      this.toast.success('Técnico atualizado com sucesso', 'Atualização');
      this.router.navigate(['tecnicos']);
    }, ex => {
      if (ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);          
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

  addPerfil(perfil: any): void {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil));
      console.log(this.tecnico.perfis);
    } else {
      this.tecnico.perfis.push(perfil);
      console.log(this.tecnico.perfis);
    }
  }

  validarCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
  }

}
