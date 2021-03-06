import 'reflect-metadata'
import ICaseFileInfoModel from '../types/ICaseFileInfoModel'
import store from '@/store'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getICaseFileInfoModel } from '@/graphql/queries'
import IVuexCaseFileService from './IVuexCaseFileService'
import CaseFileStore from '../state-management/CaseFileStore'
import { injectable } from 'inversify-props'

const caseFileStore = getModule(CaseFileStore)

@injectable()
export default class VuexCaseFileService implements IVuexCaseFileService {
  get getMultipleCaseFiles () : (filter: object) => ICaseFileInfoModel[] {
    return (filter: object) : ICaseFileInfoModel[] => {
      return caseFileStore.getMultipleCaseFiles(filter)
    }
  }

  get getSingleCaseFile () : (id: string) => ICaseFileInfoModel | null {
    return (id: string) : ICaseFileInfoModel | null => {
      return caseFileStore.getSingleCaseFile(id)
    }
  }

  public saveCaseFiles (newCaseFiles: ICaseFileInfoModel[]) : ICaseFileInfoModel[] {
    return caseFileStore.saveCaseFiles(newCaseFiles)
  }

  public updateCaseFile (caseFile: ICaseFileInfoModel) : void {
    caseFileStore.updateCaseFile(caseFile)
  }

  public removeCaseFile (caseFileToRemove: ICaseFileInfoModel) : void {
    caseFileStore.removeCaseFile(caseFileToRemove)
  }

  public clearCache () : void {
    caseFileStore.clearCasefilesFromStore()
  }
}
